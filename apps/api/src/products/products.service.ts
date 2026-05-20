import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly storageService: StorageService,
  ) {}

  // PRODUCTS

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { active: true },
      relations: ['variants'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, active: true },
      relations: ['variants'],
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    return product;
  }

  async create(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = this.productRepository.create(dto);

    if (file) {
      const uploaded = await this.storageService.uploadImage(file, 'products');
      product.image_url = uploaded.secure_url;
      product.public_id = uploaded.public_id;
    }
    return this.productRepository.save(product);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (file) {
      if (product.public_id) {
        await this.storageService.deleteImage(product.public_id);
      }
      const uploaded = await this.storageService.uploadImage(file, 'products');
      product.image_url = uploaded.secure_url;
      product.public_id = uploaded.public_id;
    }
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    // Borrado lógico
    product.active = false;
    await this.productRepository.save(product);
  }

  // VARIANTS

  async findVariant(
    productId: string,
    variantId: string,
  ): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId, product: { id: productId } },
    });

    if (!variant) throw new NotFoundException('Variante no encontrada');

    return variant;
  }

  async createVariant(
    productId: string,
    dto: CreateVariantDto,
  ): Promise<ProductVariant> {
    // Verificamos que el producto existe antes de crearlo
    const product = await this.findOne(productId);

    const variant = this.variantRepository.create({
      ...dto,
      product,
    });

    return this.variantRepository.save(variant);
  }

  async updateVariant(
    productId: string,
    variantId: string,
    dto: UpdateVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.findVariant(productId, variantId);
    Object.assign(variant, dto);
    return this.variantRepository.save(variant);
  }

  async removeVariant(productId: string, variantId: string): Promise<void> {
    const variant = await this.findVariant(productId, variantId);
    // Borrado lógico
    variant.active = false;
    await this.variantRepository.save(variant);
  }
}
