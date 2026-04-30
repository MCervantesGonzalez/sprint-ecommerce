import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // PRODUCTS

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los productos activos' })
  @ApiResponse({ status: 200, description: 'Lista de productos con variantes' })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear producto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar producto (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Producto desactivado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // VARIANTS

  @Roles(Role.ADMIN)
  @Post(':id/variants')
  @ApiOperation({ summary: 'Agregar variante a producto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Variante creada' })
  createVariant(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.productsService.createVariant(productId, dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/variants/:variantId')
  @ApiOperation({ summary: 'Actualizar variante (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Variante actualizada' })
  updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(productId, variantId, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar variante (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Variante desactivada' })
  removeVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.removeVariant(productId, variantId);
  }
}
