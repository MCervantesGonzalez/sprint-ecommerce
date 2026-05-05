import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { OrderStatus } from '../orders/entities/order.entity';
import { AdminOrdersQueryDto, LowStockQueryDto } from './dto/admin-query.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboard() {
    const [ordersByStatus, revenueResult, lowStockCount, recentOrders] =
      await Promise.all([
        this.getOrderCountsByStatus(),
        this.getTotalRevenue(),
        this.getLowStockCount(),
        this.getRecentOrders(5),
      ]);

    return {
      orders: {
        byStatus: ordersByStatus,
        total: Object.values(ordersByStatus).reduce((a, b) => a + b, 0),
      },
      revenue: {
        total: revenueResult,
        currency: 'MXN',
      },
      lowStockCount,
      recentOrders,
    };
  }

  private async getOrderCountsByStatus(): Promise<Record<string, number>> {
    const rows = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany<{ status: string; count: string }>();

    // Inicializar todos los estados en 0
    const result = Object.values(OrderStatus).reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<string, number>,
    );

    rows.forEach(({ status, count }) => {
      result[status] = parseInt(count, 10);
    });

    return result;
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('COALESCE(SUM(order.total), 0)', 'total')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .getRawOne<{ total: string }>();

    return parseFloat(result?.total ?? '0');
  }

  private async getLowStockCount(threshold = 5): Promise<number> {
    return this.variantRepo.count({
      where: { stock: LessThanOrEqual(threshold), active: true },
    });
  }

  private async getRecentOrders(limit: number) {
    return this.orderRepo.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      select: {
        id: true,
        status: true,
        total: true,
        created_at: true,
        user: { id: true, name: true, email: true },
      },
    });
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async getOrders(query: AdminOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'item')
      .orderBy('order.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.status) {
      qb.where('order.status = :status', { status: query.status });
    }

    const [orders, total] = await qb.getManyAndCount();

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Low Stock ────────────────────────────────────────────────────────────

  async getLowStockProducts(query: LowStockQueryDto) {
    const threshold = query.threshold ?? 5;

    const variants = await this.variantRepo
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('variant.stock <= :threshold', { threshold })
      .andWhere('variant.active = :active', { active: true })
      .andWhere('product.active = :active', { active: true })
      .orderBy('variant.stock', 'ASC')
      .getMany();

    return {
      threshold,
      total: variants.length,
      data: variants,
    };
  }
}
