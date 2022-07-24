import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Bookmark Notes project')
    .setDescription(
      'Allow to CRUD operations for Note/Bookmark object, auth with refresh token, Edit user',
    )
    .setVersion('1.0')
    .addTag('BookmarkNotes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5050);
}
bootstrap();
