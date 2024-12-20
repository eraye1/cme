import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseType } from '@prisma/client';

@Injectable()
export class RequirementsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.jurisdictionRequirement.findMany({
      include: {
        requirements: true,
        specialRequirements: true,
        legalCitations: true,
      },
    });
  }

  findOne(state: string, licenseType: LicenseType) {
    return this.prisma.jurisdictionRequirement.findUnique({
      where: {
        state_licenseType: {
          state,
          licenseType,
        },
      },
      include: {
        requirements: true,
        specialRequirements: true,
        legalCitations: true,
      },
    });
  }
} 