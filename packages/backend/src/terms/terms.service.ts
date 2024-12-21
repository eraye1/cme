import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TermsService {
  constructor(private prisma: PrismaService) {}

  async recordAcceptance(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        tosAcceptedAt: new Date(),
        tosVersion: '1.0',
      },
      select: {
        id: true,
        tosAcceptedAt: true,
        tosVersion: true,
      },
    });
  }

  async hasAcceptedTerms(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        tosAcceptedAt: true,
      },
    });
    return !!user?.tosAcceptedAt;
  }
} 