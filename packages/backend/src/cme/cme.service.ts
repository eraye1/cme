import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmeCreditDto } from './dto/create-cme-credit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CmeService {
  constructor(private prisma: PrismaService) {}

  async createCredit(userId: string, dto: CreateCmeCreditDto) {
    const { templateId, requirementId, ...data } = dto;
    
    const createData: Prisma.CmeCreditCreateInput = {
      ...data,
      user: { connect: { id: userId } },
      ...(templateId && {
        template: { connect: { id: templateId } },
      }),
      ...(requirementId && {
        requirement: { connect: { id: requirementId } },
      }),
    };

    return this.prisma.cmeCredit.create({
      data: createData,
      include: {
        template: true,
        requirement: true,
        documents: true,
      },
    });
  }

  async getCreditsByUser(userId: string) {
    return this.prisma.cmeCredit.findMany({
      where: { userId },
      include: {
        documents: true,
        template: true,
        requirement: true,
      },
    });
  }

  async getCreditsByRequirement(userId: string, requirementId: string) {
    return this.prisma.cmeCredit.findMany({
      where: {
        userId,
        requirementId,
      },
      include: {
        documents: true,
        template: true,
      },
    });
  }
} 