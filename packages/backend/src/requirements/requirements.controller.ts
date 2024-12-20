import { Controller, Get, Param } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { LicenseType } from '@prisma/client';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get()
  findAll() {
    return this.requirementsService.findAll();
  }

  @Get(':state/:licenseType')
  findOne(@Param('state') state: string, @Param('licenseType') licenseType: LicenseType) {
    return this.requirementsService.findOne(state, licenseType);
  }
} 