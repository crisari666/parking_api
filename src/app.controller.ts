import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getCollectionsInfo')
  async getCollectionsInfo(@Res() response): Promise<any> {
    try {
      const result = await this.appService.getCollection();
      return response.status(HttpStatus.OK).json({
        result,
        message: 'success'
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'error',
        error: error.toString(),
      });
    }
  }

  @Post('/removeIndexFromCollection')
  async removeIndexFromCollection(@Body() body: any, @Res() response): Promise<any> {
    try {
      const {indexName, collectionName} = body
      const result = await this.appService.removeIndexFromCollection({indexName, keyCollection: collectionName });
      return response.status(HttpStatus.OK).json({
        result,
        message: 'success'
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'error',
        error: error.toString(),
      });
    }
  }
}
