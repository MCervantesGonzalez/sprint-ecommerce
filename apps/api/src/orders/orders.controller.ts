import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ADMIN

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(orderId, dto);
  }

  // CLIENT

  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Post()
  createFromCart(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(req.user.id, dto);
  }

  // ADMIN + CLIENT

  @Get(':id')
  findOne(@Request() req: any, @Param('id') orderId: string) {
    return this.ordersService.findOne(orderId, req.user.id, req.user.role);
  }
}
