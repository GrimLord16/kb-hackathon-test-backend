import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true, // Reflect the request's credentials mode
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 5005);
}
bootstrap();
