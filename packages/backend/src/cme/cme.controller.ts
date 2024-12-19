import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CmeService } from './cme.service';
import { CreateCmeCreditDto } from './dto/create-cme-credit.dto';

@Controller('cme')
export class CmeController {
  constructor(private readonly cmeService: CmeService) {}

  @Post(':userId/credits')
  createCredit(
    @Param('userId') userId: string,
    @Body() createCmeCreditDto: CreateCmeCreditDto,
  ) {
    return this.cmeService.createCredit(userId, createCmeCreditDto);
  }

  @Get(':userId/credits')
  getCreditsByUser(@Param('userId') userId: string) {
    return this.cmeService.getCreditsByUser(userId);
  }

  @Get(':userId/requirements/:requirementId/credits')
  getCreditsByRequirement(
    @Param('userId') userId: string,
    @Param('requirementId') requirementId: string,
  ) {
    return this.cmeService.getCreditsByRequirement(userId, requirementId);
  }
} 