import { Controller, Get, Param, Headers, ForbiddenException } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { UserHeader } from '../app/types/user-header.type';
import { UserRole } from '../app/schemas/user.schema';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('resume/date/:date')
  getFinancialResumeByDate(
    @Param('date') date: string,
    @Headers('user') user: UserHeader,
  ) {
    const businessId = user.business;
    return this.financialService.getFinancialResumeByDate(date, businessId);
  }

  @Get('resume/date/:date/business/:businessId')
  getFinancialResumeByDateAndBusiness(
    @Param('date') date: string,
    @Param('businessId') businessId: string,
    @Headers('user') user: UserHeader,
  ) {
    if (!user || user.role !== UserRole.admin) {
      throw new ForbiddenException('Only admin users can get financial resume filtered by business');
    }
    return this.financialService.getFinancialResumeByDate(date, businessId);
  }
}
