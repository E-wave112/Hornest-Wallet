import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerInit = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('A wallets API')
    .setDescription('The document for the wallets API')
    .setVersion('1.0.0')
    .addTag('wallets')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
