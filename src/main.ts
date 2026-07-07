import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.enableCors({
    // origin: 'http://localhost:3000', // allow your frontend origin
    // credentials: true,               // allow cookies to be sent
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
