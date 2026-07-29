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
import { VerifyEmailDto } from './dto/verify-email.dto';
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

    // Generar y enviar token de verificación (no bloquea el registro si falla el correo)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await this.usersService.setVerifyToken(user.id, token, expires);

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    try {
      await this.notificationsService.sendEmailVerification(
        user.email,
        verifyUrl,
      );
    } catch (err) {
      // Si falla el envío del correo, no bloqueamos el registro —
      // el usuario puede pedir que se reenvíe después
    }

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
        email_verified: user.email_verified,
      },
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.usersService.findByVerifyToken(dto.token);

    if (!user || !user.verify_token_expires) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (user.verify_token_expires.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    await this.usersService.verifyEmail(user.id);

    return { message: 'Correo verificado correctamente' };
  }

  async resendVerification(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.email_verified) {
      return { message: 'Tu correo ya está verificado' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.usersService.setVerifyToken(user.id, token, expires);

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
    await this.notificationsService.sendEmailVerification(
      user.email,
      verifyUrl,
    );

    return { message: 'Correo de verificación reenviado' };
  }
}
