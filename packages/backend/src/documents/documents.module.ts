import { Module, forwardRef } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentProcessingService } from './services/document-processing.service';
import { ValidationService } from './services/validation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.uploadConfig.directory,
        limits: {
          fileSize: configService.uploadConfig.maxSize,
        },
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: join(process.cwd(), configService.uploadConfig.directory),
        serveRoot: '/uploads',
      }],
    }),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentProcessingService,
    ValidationService,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {} 