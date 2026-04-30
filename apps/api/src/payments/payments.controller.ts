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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference/:orderId')
  createPreference(@Param('orderId') orderId: string, @Request() req: any) {
    return this.paymentsService.createPreference(orderId, req.user.id);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() body: any) {
    console.log('--- WEBHOOK CONTROLLER ---');
    console.log(JSON.stringify(body, null, 2));

    return this.paymentsService.handleWebhook(body);
  }
}
