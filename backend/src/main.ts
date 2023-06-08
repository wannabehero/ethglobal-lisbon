import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
