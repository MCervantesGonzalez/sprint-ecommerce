import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password_hash,
      phone: dto.phone,
    });

    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciales inválidas');

    return this.buildResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    // Respuesta genérica siempre — no revelamos si el email existe o no
    if (!user) {
      return {
        message: 'Si el correo existe, se envió un enlace de recuperación',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.usersService.setResetToken(user.id, token, expires);

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.notificationsService.sendPasswordReset(user.email, resetUrl);

    return {
      message: 'Si el correo existe, se envió un enlace de recuperación',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(dto.token);

    if (!user || !user.reset_token_expires) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (user.reset_token_expires.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    await this.usersService.resetPassword(user.id, password_hash);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // Método privado reutilizable para construir la respuesta con token
  private buildResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
