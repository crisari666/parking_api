import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ConfigModule } from './config/config.module';
import { AuthTokenMiddleware } from './app/middlewares/auth-middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TokenValidationService } from './app/middlewares/token-validation.service';
@Module({
  imports: [
    ConfigModuleNest.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.HOST}:${process.env.PORT_DB}/${process.env.DB_NAME}`),
    UsersModule,
    AuthModule,
    ConfigModule,

  ],
  controllers: [AppController],
  providers: [AppService, TokenValidationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes('*');
  }
}
