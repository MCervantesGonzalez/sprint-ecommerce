import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: false, // TLS
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendOrderConfirmation(order: Order, email: string): Promise<void> {
    const itemsList = order.items
      .map(
        (item) =>
          `<tr>
            <td>${item.snapshot_name}</td>
            <td>${item.quantity}</td>
            <td>$${item.unit_price}</td>
            <td>$${Number(item.unit_price) * item.quantity}</td>
          </tr>`,
      )
      .join('');

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: `Confirmación de orden #${order.id.slice(0, 8)}`,
      html: `
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu orden ha sido recibida y está siendo procesada.</p>
        <h3>Detalle de tu orden</h3>
        <table border="1" cellpadding="8" cellspacing="0">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        <p><strong>Total: $${order.total}</strong></p>
        <p><strong>Dirección de envío:</strong> ${order.shipping_address}</p>
        <p>Te notificaremos cuando tu pedido sea enviado.</p>
      `,
    });
    this.logger.log(`Email de confirmación enviado a ${email}`);
  }

  async sendPaymentConfirmation(order: Order, email: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: `Pago confirmado - Orden  #${order.id.slice(0, 8)}`,
      html: `
        <h2>¡Pago recibido!</h2>
        <p>Hemos confirmado tu pago por <strong>$${order.total}</strong>.</p>
        <p>Tu orden está siendo preparada.</p>
        <p><strong>ID de pago:</strong> ${order.mp_payment_id}</p>
      `,
    });
    this.logger.log(`Email de pago confirmado enviado a ${email}`);
  }

  async sendShippingNotification(order: Order, email: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: `Tu orden #${order.id.slice(0, 8)} ha sido enviada`,
      html: `
        <h2>¡Tu pedido está en camino!</h2>
        <p>Tu orden ha sido enviada a:</p>
        <p><strong>${order.shipping_address}</strong></p>
        <p>Pronto recibirás tu pedido.</p>
      `,
    });

    this.logger.log(`Email de envío notificado a ${email}`);
  }
}
