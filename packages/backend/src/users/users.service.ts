import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LicenseType, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        licenseNumber: data.licenseNumber,
        specialty: data.specialty,
        licenseType: data.licenseType,
        states: data.states || [],
        credentials: [],
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        licenseNumber: true,
        specialty: true,
        licenseType: true,
        states: true,
        credentials: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(
    userId: string,
    updateData: { states?: string[]; licenseType?: LicenseType }
  ) {
    const data: Prisma.UserUpdateInput = {
      ...(updateData.states && { states: updateData.states }),
      ...(updateData.licenseType && { licenseType: updateData.licenseType }),
    };

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        licenseNumber: true,
        specialty: true,
        licenseType: true,
        states: true,
        credentials: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
} 