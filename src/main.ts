import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://kb-hackathon-test.vercel.app',
    process.env.ALLOWED_ORIGIN ?? '',
  ],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  await app.listen(5005);
}
bootstrap();
