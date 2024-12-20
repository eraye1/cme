import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';
import { LicenseType } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsOptional()
  licenseType?: LicenseType;

  @IsArray()
  @IsOptional()
  states?: string[];
} 