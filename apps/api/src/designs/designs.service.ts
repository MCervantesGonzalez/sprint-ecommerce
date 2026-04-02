import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Design } from './entities/design.entity';
import { ProductDesign } from './entities/product-design.entity';
import { Product } from 'src/products/entities/product.entity';
import { StorageService } from 'src/storage/storage.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { AssignDesignDto } from './dto/assign-design.dto';

@Injectable()
export class DesignsService {
  constructor(
    @InjectRepository(Design)
    private readonly designRepository: Repository<Design>,
    @InjectRepository(ProductDesign)
    private readonly productDesignRepository: Repository<ProductDesign>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storageService: StorageService,
  ) {}

  // DESIGNS

  async findAll(): Promise<Design[]> {
    return this.designRepository.find({
      where: { active: true },
    });
  }

  async findOne(id: string): Promise<Design> {
    const design = await this.designRepository.findOne({
      where: { id, active: true },
    });

    if (!design) throw new NotFoundException('Diseño no encontrado');

    return design;
  }

  async create(
    dto: CreateDesignDto,
    file: Express.Multer.File,
  ): Promise<Design> {
    //Subimos la imagen a Cloudinary
    const uploaded = await this.storageService.uploadImage(file, 'designs');

    const design = this.designRepository.create({
      ...dto,
      image_url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });

    return this.designRepository.save(design);
  }

  async update(
    id: string,
    dto: UpdateDesignDto,
    file?: Express.Multer.File,
  ): Promise<Design> {
    const design = await this.findOne(id);

    // Si viene una nueva imagen, reemplazamos la anterior en Cloudinary
    if (file) {
      if (design.public_id) {
        await this.storageService.deleteImage(design.public_id);
      }
      const uploaded = await this.storageService.uploadImage(file, 'designs');
      design.image_url = uploaded.secure_url;
      design.public_id = uploaded.public_id;
    }

    Object.assign(design, dto);
    return this.designRepository.save(design);
  }

  async remove(id: string): Promise<void> {
    const design = await this.findOne(id);
    design.active = false;
    await this.designRepository.save(design);
  }

  // PRODUCT DESIGNS

  async assignToProduct(
    productId: string,
    dto: AssignDesignDto,
  ): Promise<ProductDesign> {
    const product = await this.productRepository.findOne({
      where: { id: productId, active: true },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const design = await this.findOne(dto.designId);

    const ProductDesign = this.productDesignRepository.create({
      product,
      design,
      extra_price: dto.extra_price ?? 0,
    });

    return this.productDesignRepository.save(ProductDesign);
  }

  async findProductDesigns(productId: string): Promise<ProductDesign[]> {
    return this.productDesignRepository.find({
      where: { product: { id: productId } },
      relations: ['design'],
    });
  }

  async removeProductDesign(
    productId: string,
    designId: string,
  ): Promise<void> {
    const ProductDesign = await this.productDesignRepository.findOne({
      where: {
        product: { id: productId },
        design: { id: designId },
      },
    });

    if (!ProductDesign) throw new NotFoundException('Asignación no encontrada');

    await this.productDesignRepository.remove(ProductDesign);
  }
}
