import { Controller, Get, Param, Headers } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { UserHeader } from '../app/types/user-header.type';

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
}
