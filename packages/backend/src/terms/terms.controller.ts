import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { TermsService } from './terms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('terms')
@UseGuards(JwtAuthGuard)
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post('accept')
  async acceptTerms(@Req() req) {
    return this.termsService.recordAcceptance(req.user.id);
  }

  @Get('status')
  async getTermsStatus(@Req() req) {
    return {
      hasAccepted: await this.termsService.hasAcceptedTerms(req.user.id),
    };
  }
} 