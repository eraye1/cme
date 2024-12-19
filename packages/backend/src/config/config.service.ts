import { Injectable } from '@nestjs/common';
import { env } from './env.config';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    return env.DATABASE_URL;
  }

  get jwtConfig() {
    return {
      secret: env.JWT_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_EXPIRATION,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRATION,
    };
  }

  get openAiConfig() {
    return {
      apiKey: env.OPENAI_API_KEY,
    };
  }

  get uploadConfig() {
    return {
      maxSize: env.MAX_FILE_SIZE,
      directory: env.UPLOAD_DIR,
      allowedTypes: env.ALLOWED_FILE_TYPES.split(','),
    };
  }

  get serverConfig() {
    return {
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
    };
  }

  get isDevelopment(): boolean {
    return env.NODE_ENV === 'development';
  }

  get isProduction(): boolean {
    return env.NODE_ENV === 'production';
  }
} 