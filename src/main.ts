import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { JwtMiddleware } from './middleware/jwtMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  // app.use(JwtMiddleware);
  await app.listen(5000);
}

bootstrap();
