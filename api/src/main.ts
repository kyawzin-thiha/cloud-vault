import { ConfigService, ConfigService as ConfigServiceType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigServiceType>(ConfigService);

  app.enableCors({
    origin: configService.get('CLIENT_URL') || 'http://localhost:3000',
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.use(compression());

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
bootstrap();
