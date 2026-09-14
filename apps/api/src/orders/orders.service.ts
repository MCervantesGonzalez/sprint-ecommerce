import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../common/enums/role.enum';
import { NotificationsService } from '../notifications/notifications.service';

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
    private readonly notificationsService: NotificationsService,
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

    // Las órdenes de invitado (sin user) no son accesibles por esta ruta
    // autenticada — para eso existe /orders/track (público, con email + id)
    if (!order.user) {
      throw new ForbiddenException('No tienes acceso a esta orden');
    }

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

    // 7.1. Notificacion de orden
    const fullOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'user'],
    });

    await this.notificationsService.sendOrderConfirmation(
      fullOrder!,
      fullOrder!.user!.email,
    );

    return fullOrder!;
  }

  // GUEST

  async createGuestOrder(dto: CreateGuestOrderDto): Promise<Order> {
    if (!dto.items.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    // 1. Traemos las variantes reales y verificamos stock/existencia
    const variantIds = dto.items.map((i) => i.variantId);
    const variants = await this.variantRepository.find({
      where: { id: In(variantIds) },
      relations: ['product'],
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    for (const item of dto.items) {
      const variant = variantMap.get(item.variantId);
      if (!variant || !variant.active) {
        throw new BadRequestException(
          `La variante ${item.variantId} ya no está disponible`,
        );
      }
      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.variantId}`,
        );
      }
    }

    // 2. Calculamos el total
    const subtotal = dto.items.reduce((sum, item) => {
      const variant = variantMap.get(item.variantId)!;
      return sum + Number(variant.base_price) * item.quantity;
    }, 0);

    // 3. Creamos la orden (sin user)
    const order = this.orderRepository.create({
      user: null,
      guest_email: dto.guest_email,
      guest_name: dto.guest_name,
      guest_phone: dto.guest_phone,
      shipping_address: dto.shipping_address,
      subtotal,
      total: subtotal,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // 4. Order items con snapshot
    const orderItems = dto.items.map((item) => {
      const variant = variantMap.get(item.variantId)!;
      return this.orderItemRepository.create({
        order: savedOrder,
        variant,
        design: item.designId ? ({ id: item.designId } as any) : null,
        quantity: item.quantity,
        unit_price: Number(variant.base_price),
        snapshot_name: `${variant.product?.name ?? 'Producto'} - ${variant.color} ${variant.size}`,
      });
    });

    await this.orderItemRepository.save(orderItems);

    // 5. Descontamos stock
    for (const item of dto.items) {
      await this.variantRepository.decrement(
        { id: item.variantId },
        'stock',
        item.quantity,
      );
    }

    // 6. Notificación al correo del invitado
    const fullOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });

    await this.notificationsService.sendOrderConfirmation(
      fullOrder!,
      dto.guest_email,
    );

    return fullOrder!;
  }

  // TRACKING PÚBLICO (invitado o logueado, sin auth)

  async trackOrder(orderId: string, email: string): Promise<Order> {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Limpiamos por si el usuario copió el ID con "#" u otros caracteres
    const cleanId = orderId.trim().replace(/^#/, '');

    if (!uuidRegex.test(cleanId)) {
      throw new NotFoundException(
        'Número de orden inválido. Revisa el correo de confirmación y copia el número completo.',
      );
    }

    const order = await this.orderRepository.findOne({
      where: { id: cleanId },
      relations: ['items', 'user'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    const orderEmail = order.user?.email ?? order.guest_email;

    if (orderEmail?.toLowerCase() !== email.trim().toLowerCase()) {
      throw new ForbiddenException('No tienes acceso a esta orden');
    }

    return order;
  }
}
