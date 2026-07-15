import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: "http://localhost:3002",
    credentials: true,
  });
      
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config =
    new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription(
        'Intern E-Commerce Backend APIs',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  await app.listen(
    process.env.PORT ?? 3000,
  );

  console.log(
    `Application running on: ${await app.getUrl()}`,
  );
}
bootstrap();