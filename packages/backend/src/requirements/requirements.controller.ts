import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createRequirementDto: CreateRequirementDto,
  ) {
    return this.requirementsService.create(userId, createRequirementDto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.requirementsService.findByUser(userId);
  }

  @Get(':userId/:requirementId/progress')
  getProgress(
    @Param('userId') userId: string,
    @Param('requirementId') requirementId: string,
  ) {
    return this.requirementsService.getProgress(userId, requirementId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequirementDto: Partial<CreateRequirementDto>,
  ) {
    return this.requirementsService.update(id, updateRequirementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requirementsService.remove(id);
  }
} 