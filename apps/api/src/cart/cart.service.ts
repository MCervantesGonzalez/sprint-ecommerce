import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Design } from '../designs/entities/design.entity';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Design)
    private readonly designRepository: Repository<Design>,
  ) {}

  // Obtiene el carrito del usuario o lo crea si no existe
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'items',
        'items.variant',
        'items.variant.product',
        'items.design',
      ],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      cart = await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  async getCart(userId: string): Promise<Cart & { total: number }> {
    const cart = await this.getOrCreateCart(userId);

    // Calculamos el total del carrito
    const total = cart.items.reduce((sum, item) => {
      const base = Number(item.variant.base_price);
      return sum + base * item.quantity;
    }, 0);

    return { ...cart, total };
  }

  async addItem(userId: string, dto: AddItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Verificamos que la variante existe y tiene stock
    const variant = await this.variantRepository.findOne({
      where: { id: dto.variantId, active: true },
    });
    if (!variant) throw new NotFoundException('Variante no encontrada');
    if (variant.stock < dto.quantity) {
      throw new BadRequestException('Stock insuficiente');
    }

    // Verificamos el diseño si viene en el DTO
    let design: Design | undefined = undefined;

    if (dto.designId) {
      const foundDesign = await this.designRepository.findOne({
        where: { id: dto.designId, active: true },
      });
      if (!foundDesign) throw new NotFoundException('Diseño no encontrado');
      design = foundDesign;
    }

    // Si el item ya existe en el carrito, sumamos la cantidad
    const existingItem = cart.items.find(
      (item) =>
        item.variant.id === dto.variantId && item.design?.id === dto.designId,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        variant,
        design: design ?? undefined, //convierte null a undefined
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item no encontrado');

    // Verificamos stock antes de actualizar
    if (item.variant.stock < dto.quantity) {
      throw new BadRequestException('Stock insuficiente');
    }

    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item no encontrado');

    await this.cartItemRepository.remove(item);

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.remove(cart.items);
  }
}
