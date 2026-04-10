import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from 'src/cart/cart.service';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly cartService: CartService,
  ) {}

  // ADMIN

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  // CLIENT

  async findMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(
    orderId: string,
    userId: string,
    userRole: Role,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    //CLIENT solo puede ver sus propias órdenes
    if (userRole === Role.CLIENT && order.user.id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta orden');
    }
    return order;
  }

  async createFromCart(userId: string, dto: CreateOrderDto): Promise<Order> {
    // 1. Obtenemos el carrito con su total
    const cart = await this.cartService.getCart(userId);

    if (!cart.items.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    // 2. Verificamos stock de todas las variantes antes de crear la orden
    for (const item of cart.items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.variant.id },
      });

      if (!variant || !variant.active) {
        throw new BadRequestException(
          `La variante ${item.variant.id} ya no está disponible`,
        );
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.variant.id}`,
        );
      }
    }

    // 3. Calculamos subtotal y total
    const subtotal = cart.total;
    const total = subtotal; // aquí podrías agregar costos de envío en el futuro

    // 4. Creamos la orden
    const order = this.orderRepository.create({
      user: { id: userId },
      shipping_address: dto.shipping_address,
      subtotal,
      total,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // 5. Creamos los order items con snapshot del nombre
    const orderItems = cart.items.map((item) => {
      return this.orderItemRepository.create({
        order: savedOrder,
        variant: item.variant,
        design: item.design,
        quantity: item.quantity,
        unit_price: Number(item.variant.base_price),
        snapshot_name: `${item.variant.product?.name ?? 'Producto'} - ${item.variant.color} ${item.variant.size}`,
      });
    });

    await this.orderItemRepository.save(orderItems);

    // 6. Descontamos stock
    for (const item of cart.items) {
      await this.variantRepository.decrement(
        { id: item.variant.id },
        'stock',
        item.quantity,
      );
    }

    // 7. Vaciamos el carrito
    await this.cartService.clearCart(userId);

    // 8. Retornamos la orden completa
    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    }) as Promise<Order>;
  }
}
