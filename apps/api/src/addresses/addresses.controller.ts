import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mis direcciones guardadas' })
  @ApiResponse({ status: 200, description: 'Lista de direcciones' })
  findAll(@Req() req: any) {
    return this.addressesService.findAllByUser(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear dirección' })
  @ApiResponse({ status: 201, description: 'Dirección creada' })
  create(@Req() req: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar dirección' })
  @ApiResponse({ status: 200, description: 'Dirección actualizada' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar dirección' })
  @ApiResponse({ status: 204, description: 'Dirección eliminada' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.addressesService.remove(req.user.id, id);
  }
}
