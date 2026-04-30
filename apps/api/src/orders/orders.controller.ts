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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ADMIN

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todas las órdenes (ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes con usuario e items',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de una orden (ADMIN)' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(orderId, dto);
  }

  // CLIENT

  @Get('my-orders')
  @ApiOperation({ summary: 'Ver mis órdenes (CLIENT)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes del usuario autenticado',
  })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear orden desde carrito' })
  @ApiResponse({ status: 201, description: 'Orden creada con items y totales' })
  @ApiResponse({
    status: 400,
    description: 'Carrito vacío o stock insuficiente',
  })
  createFromCart(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(req.user.id, dto);
  }

  // ADMIN + CLIENT

  @Get(':id')
  @ApiOperation({ summary: 'Ver una orden por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 403, description: 'No tienes acceso a esta orden' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Request() req: any, @Param('id') orderId: string) {
    return this.ordersService.findOne(orderId, req.user.id, req.user.role);
  }
}
