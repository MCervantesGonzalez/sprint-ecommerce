import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference/:orderId')
  @ApiOperation({ summary: 'Crear preferencia de pago en MercadoPago' })
  @ApiParam({ name: 'orderId', description: 'UUID de la orden a pagar' })
  @ApiResponse({
    status: 201,
    description: 'Retorna init_point para redirigir al checkout',
  })
  @ApiResponse({ status: 400, description: 'La orden ya fue procesada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  createPreference(@Param('orderId') orderId: string, @Request() req: any) {
    return this.paymentsService.createPreference(orderId, req.user.id);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de Mercadopago - solo para uso interno' })
  @ApiResponse({
    status: 200,
    description: 'Notificación recibida correctamente',
  })
  handleWebhook(@Body() body: any) {
    console.log('--- WEBHOOK CONTROLLER ---');
    console.log(JSON.stringify(body, null, 2));

    return this.paymentsService.handleWebhook(body);
  }
}
