import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './utils';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  // <--  Swagger setup  -->
  SwaggerInit(app);

  await app.listen(port, () => {
    Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
    Logger.log(`Swagger running on http://localhost:${port}/docs`, 'Swagger');
  });
}
bootstrap();
