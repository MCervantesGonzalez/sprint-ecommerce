import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MercadopagoConfig, { Preference, Payment } from 'mercadopago';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  private readonly mpClient: MercadopagoConfig;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    this.mpClient = new MercadopagoConfig({
      accessToken: this.config.get<string>('MP_ACCESS_TOKEN')!,
    });
  }

  // CREAR PREFERENCIA

  async createPreference(
    orderId: string,
    userId: string,
  ): Promise<{ init_point: string }> {
    // 1 Obtenemos la orden con  sus items
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('La orden ya fue procesada');
    }

    // 2 Construimos los items para MercadoPago

    const items = order.items.map((item) => ({
      id: item.id,
      title: item.snapshot_name,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      currency_id: 'MXN',
    }));

    // 3 Creamos la preferencia en MercadoPago
    const preference = new Preference(this.mpClient);
    const response = await preference.create({
      body: {
        items,
        external_reference: orderId, // lo usamos en el webhook para identificar la orden
        back_urls: {
          success: `${this.config.get('FRONTEND_URL')}/ORDERS${orderId}?status=success`,
          pending: `${this.config.get('FRONTEND_URL')}/ORDERS${orderId}?status=pending`,
          failure: `${this.config.get('FRONTEND_URL')}/ORDERS${orderId}?status=failure`,
        },
        // auto_return: 'approved',
        notification_url: `${this.config.get('BACKEND_URL')}/api/payments/webhook`,
      },
    });

    // 4 Guardamos el mp_preference_id en la orden
    order.mp_preference_id = response.id!;
    await this.orderRepository.save(order);

    return { init_point: response.init_point! };
  }

  // WEBHOOK

  async handleWebhook(body: any): Promise<void> {
    // MercadoPago manda diferentes tipos de notificaciones
    if (body.type !== 'payment') return;

    const paymentId = body.data?.id;
    if (!paymentId) return;

    // Consultamos el pago en MercadoPago para verificar su estado
    const payment = new Payment(this.mpClient);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status !== 'approved') return;

    // Buscamos la orden por el external_reference que pusimos al crear la preferencia
    const orderId = paymentData.external_reference;
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) return;
    if (order.status === OrderStatus.PAID) return; // idempotencia - evitamos procesar dos veces

    // Actualizamos la orden
    order.status = OrderStatus.PAID;
    order.mp_payment_id = String(paymentId);
    await this.orderRepository.save(order);
  }
}
