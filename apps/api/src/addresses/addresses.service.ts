import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findAllByUser(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: userId } },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!address) throw new NotFoundException('Dirección no encontrada');

    return address;
  }

  async create(userId: string, dto: CreateAddressDto): Promise<Address> {
    // Si es la primera dirección del usuario, se marca default automáticamente
    const existingCount = await this.addressRepository.count({
      where: { user: { id: userId } },
    });
    const shouldBeDefault = dto.is_default || existingCount === 0;

    if (shouldBeDefault) {
      await this.unsetPreviousDefault(userId);
    }

    const address = this.addressRepository.create({
      ...dto,
      is_default: shouldBeDefault,
      user: { id: userId } as any,
    });

    return this.addressRepository.save(address);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(userId, id);

    if (dto.is_default) {
      await this.unsetPreviousDefault(userId);
    }

    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async remove(userId: string, id: string): Promise<void> {
    const address = await this.findOne(userId, id);
    const wasDefault = address.is_default;

    await this.addressRepository.remove(address);

    // Si borramos la default, promovemos la más reciente restante
    if (wasDefault) {
      const [next] = await this.addressRepository.find({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
        take: 1,
      });
      if (next) {
        next.is_default = true;
        await this.addressRepository.save(next);
      }
    }
  }

  private async unsetPreviousDefault(userId: string): Promise<void> {
    await this.addressRepository.update(
      { user: { id: userId }, is_default: true },
      { is_default: false },
    );
  }
}
