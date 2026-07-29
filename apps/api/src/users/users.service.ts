import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  async getProfile(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateProfile(
    id: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.getProfile(id);

    if (file) {
      if (user.avatar_public_id) {
        await this.storageService.deleteImage(user.avatar_public_id);
      }
      const uploaded = await this.storageService.uploadImage(file, 'avatars');
      user.avatar_url = uploaded.secure_url;
      user.avatar_public_id = uploaded.public_id;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    const exists = await this.findByEmail(data.email as string);
    if (exists) throw new ConflictException('El email ya está registrado');

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async setResetToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      reset_token: token,
      reset_token_expires: expires,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { reset_token: token } });
  }

  async resetPassword(userId: string, password_hash: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        password_hash,
        reset_token: () => 'NULL',
        reset_token_expires: () => 'NULL',
      })
      .where('id = :userId', { userId })
      .execute();
  }

  async setVerifyToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      verify_token: token,
      verify_token_expires: expires,
    });
  }

  async findByVerifyToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { verify_token: token } });
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        email_verified: true,
        verify_token: () => 'NULL',
        verify_token_expires: () => 'NULL',
      })
      .where('id = :userId', { userId })
      .execute();
  }
}
