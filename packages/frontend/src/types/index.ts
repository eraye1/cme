export * from './auth';
export * from './documents';

export enum ActivityType {
  CONFERENCE = 'CONFERENCE',
  ONLINE_COURSE = 'ONLINE_COURSE',
  JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',
  TEACHING = 'TEACHING',
  MANUSCRIPT_REVIEW = 'MANUSCRIPT_REVIEW',
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  POINT_OF_CARE = 'POINT_OF_CARE',
  BOARD_REVIEW = 'BOARD_REVIEW',
}

export enum CreditCategory {
  CATEGORY_1 = 'CATEGORY_1',
  CATEGORY_2 = 'CATEGORY_2',
  SPECIALTY = 'SPECIALTY',
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  title?: string;
  provider?: string;
  credits?: number;
  completedDate?: string;
  expirationDate?: string;
  category?: CreditCategory;
  activityType?: ActivityType;
  confidence?: number;
  status: ProcessingStatus;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  licenseNumber?: string;
  specialty?: string;
  credentials: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  licenseNumber?: string;
  specialty?: string;
  credentials?: string[];
} 