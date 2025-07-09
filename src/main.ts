import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './app/middlewares/loggin-middleware';

async function bootstrap() {
  const databaseName = process.env.DB_NAME;
  const dataBasePass = process.env.DB_PASS
  const dataBaseUser = process.env.DB_USER
  const HOST = process.env.HOST
  const PORT_DB = process.env.PORT_DB
  const PORT_APP = process.env.PORT_APP
  console.log({dataBasePass, databaseName, dataBaseUser, HOST, PORT_DB, PORT_APP});
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(PORT_APP);
}
bootstrap();


// openssl req -x509 -newkey rsa:2048 -keyout qp_api.pem -out qp_api.pem -days 365 -nodes

// openssl rsa -in qp_api.pem -pubout -out public.pem
