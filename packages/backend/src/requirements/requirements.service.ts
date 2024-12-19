import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';

@Injectable()
export class RequirementsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateRequirementDto) {
    return this.prisma.requirement.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.requirement.findMany({
      where: { userId },
      include: {
        credits: {
          include: {
            documents: true,
          },
        },
      },
    });
  }

  async getProgress(userId: string, requirementId: string) {
    const requirement = await this.prisma.requirement.findUnique({
      where: { id: requirementId },
      include: {
        credits: true,
      },
    });

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${requirementId} not found`);
    }

    const totalEarned = requirement.credits.reduce(
      (sum, credit) => sum + credit.credits,
      0,
    );

    return {
      requirement,
      totalEarned,
      remaining: requirement.totalCredits - totalEarned,
      percentComplete: (totalEarned / requirement.totalCredits) * 100,
    };
  }

  async update(id: string, data: Partial<CreateRequirementDto>) {
    return this.prisma.requirement.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.requirement.delete({
      where: { id },
    });
  }
} 