import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { AssignDesignDto } from './dto/assign-design.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  // DESIGNS

  @Public()
  @Get()
  findAll() {
    return this.designsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateDesignDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.designsService.create(dto, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDesignDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.designsService.update(id, dto, file);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.designsService.remove(id);
  }

  // PRODUCTS DESIGNS

  @Public()
  @Get('product/:productId')
  findProductsDesigns(@Param('productId') productId: string) {
    return this.designsService.findProductDesigns(productId);
  }

  @Roles(Role.ADMIN)
  @Post('product/:productId')
  assignToProduct(
    @Param('productId') productId: string,
    @Body() dto: AssignDesignDto,
  ) {
    return this.designsService.assignToProduct(productId, dto);
  }

  @Roles(Role.ADMIN)
  @Delete('product/:productId/design/:designId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProductDesign(
    @Param('productId') productId: string,
    @Param('designId') designId: string,
  ) {
    return this.designsService.removeProductDesign(productId, designId);
  }
}
