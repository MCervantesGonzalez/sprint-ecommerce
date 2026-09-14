import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  BadRequestException,
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
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '../common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

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
  findAll(@Query() filters: FilterProductsDto) {
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Listar productos destacados' })
  @ApiResponse({ status: 200, description: 'Lista de productos destacados' })
  findFeatured() {
    return this.productsService.findFeatured();
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
  @ApiResponse({ status: 200, description: 'Producto creado' })
  @ApiResponse({ status: 400, description: 'Imagen o datos inválidos' })
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: {
          type: 'string',
          enum: ['TAZA', 'PLAYERA', 'HOODIE', 'OTRO'],
        },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        exceptionFactory: (err: any) =>
          new BadRequestException(err?.message ?? 'Imagen inválida'),
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.productsService.create(dto, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 400, description: 'Imagen o datos inválidos' })
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: {
          type: 'string',
          enum: ['TAZA', 'PLAYERA', 'HOODIE', 'OTRO'],
        },
        description: { type: 'string' },
        active: { type: 'boolean' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Solo JPG, PNG o WEBP. Tamaño máximo: 5MB',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        exceptionFactory: (err: any) =>
          new BadRequestException(err?.message ?? 'Imagen inválida'),
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, file);
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
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        size: { type: 'string' },
        color: { type: 'string' },
        stock: { type: 'number' },
        base_price: { type: 'number' },
        compare_price: { type: 'number' },
        active: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  createVariant(
    @Param('id') productId: string,
    @Body() dto: CreateVariantDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.createVariant(productId, dto, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/variants/:variantId')
  @ApiOperation({ summary: 'Actualizar variante (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Variante actualizada' })
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        size: { type: 'string' },
        color: { type: 'string' },
        stock: { type: 'number' },
        base_price: { type: 'number' },
        compare_price: { type: 'number' },
        active: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.updateVariant(productId, variantId, dto, file);
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
