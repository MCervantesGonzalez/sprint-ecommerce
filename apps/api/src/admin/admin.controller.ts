import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AdminOrdersQueryDto, LowStockQueryDto } from './dto/admin-query.dto';
import { OrderStatus } from 'src/orders/entities/order.entity';
import type { Response } from 'express';
import { ExportOrdersQueryDto } from './dto/admin-query.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Métricas generales del panel admin' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Órdenes con filtros y paginación' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getOrders(@Query() query: AdminOrdersQueryDto) {
    return this.adminService.getOrders(query);
  }

  @Get('products/low-stock')
  @ApiOperation({ summary: 'Variantes con stock bajo o igual al umbral' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: Number,
    description: 'Default: 5',
  })
  getLowStockProducts(@Query() query: LowStockQueryDto) {
    return this.adminService.getLowStockProducts(query);
  }

  @Get('orders/export')
  @ApiOperation({ summary: 'Exportar órdenes a CSV' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2026-04-30',
  })
  @ApiResponse({ status: 200, description: 'Archivo CSV descargable' })
  async exportOrders(
    @Query() query: ExportOrdersQueryDto,
    @Res() res: Response,
  ) {
    const csv = await this.adminService.exportOrdersCsv(query);

    const filename = `orders-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
