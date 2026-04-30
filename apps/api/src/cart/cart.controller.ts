import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
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
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Ver mi carrito' })
  @ApiResponse({ status: 200, description: 'Carrito con items y total' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Agregar item al carrito' })
  @ApiResponse({
    status: 201,
    description: 'Item agregado, retorna carrito actualizado',
  })
  @ApiResponse({ status: 400, description: 'Stock insuficiente' })
  @ApiResponse({ status: 404, description: 'Variante o diseño no encontrado' })
  addItem(@Request() req: any, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Actualizar cantidad de un item' })
  @ApiParam({ name: 'itemId', description: 'UUID del item en el carrito' })
  @ApiResponse({
    status: 200,
    description: 'Item actualizado, retorna carrito actualizado',
  })
  @ApiResponse({ status: 400, description: 'Stock insuficiente' })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  updateItem(
    @Request() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, itemId, dto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  @ApiParam({ name: 'itemID', description: 'UUID del item en el carrito' })
  @ApiResponse({ status: 204, description: 'Item eliminado' })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  removeItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vaciar carrito' })
  @ApiResponse({ status: 204, description: 'Carrito vaciado' })
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
