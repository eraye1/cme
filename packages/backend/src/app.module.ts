import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CmeModule } from './cme/cme.module';
import { DocumentsModule } from './documents/documents.module';
import { RequirementsModule } from './requirements/requirements.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { TermsModule } from './terms/terms.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    CmeModule,
    DocumentsModule,
    RequirementsModule,
    TermsModule,
  ],
})
export class AppModule {}
