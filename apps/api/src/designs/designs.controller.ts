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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
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
import multer from 'multer';

@ApiTags('Designs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  // DESIGNS

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los diseños activos' })
  @ApiResponse({ status: 200, description: 'Lista de diseños' })
  findAll() {
    return this.designsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un diseño por ID' })
  @ApiResponse({ status: 200, description: 'Diseño encontrado' })
  @ApiResponse({ status: 404, description: 'Diseño no encontrado' })
  findOne(@Param('id') id: string) {
    return this.designsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Crear diseño con imagen (ADMIN)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Diseño Floral' },
        description: { type: 'string', example: 'Patrón floral minimalista' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Diseño creado' })
  create(
    @Body() dto: CreateDesignDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.designsService.create(dto, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Actualizar diseño (ADMIN)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        active: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Diseño actualizado' })
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
  @ApiOperation({ summary: 'Desactivar diseño (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Diseño desactivado' })
  remove(@Param('id') id: string) {
    return this.designsService.remove(id);
  }

  // PRODUCTS DESIGNS

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Ver diseños disponibles para un producto' })
  @ApiResponse({ status: 200, description: 'Lista de diseños con extra_price' })
  findProductsDesigns(@Param('productId') productId: string) {
    return this.designsService.findProductDesigns(productId);
  }

  @Roles(Role.ADMIN)
  @Post('product/:productId')
  @ApiOperation({ summary: 'Asignar diseño a producto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Diseño asignado' })
  assignToProduct(
    @Param('productId') productId: string,
    @Body() dto: AssignDesignDto,
  ) {
    return this.designsService.assignToProduct(productId, dto);
  }

  @Roles(Role.ADMIN)
  @Delete('product/:productId/design/:designId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover diseño de producto (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Asignación eliminada' })
  removeProductDesign(
    @Param('productId') productId: string,
    @Param('designId') designId: string,
  ) {
    return this.designsService.removeProductDesign(productId, designId);
  }
}
