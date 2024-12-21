export enum ActivityType {
  CONFERENCE = 'CONFERENCE',
  ONLINE_COURSE = 'ONLINE_COURSE',
  JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',
  TEACHING = 'TEACHING',
  MANUSCRIPT_REVIEW = 'MANUSCRIPT_REVIEW',
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  POINT_OF_CARE = 'POINT_OF_CARE',
  BOARD_REVIEW = 'BOARD_REVIEW'
}

export enum CreditCategory {
  AMA_PRA_CATEGORY_1 = 'AMA_PRA_CATEGORY_1',
  AMA_PRA_CATEGORY_2 = 'AMA_PRA_CATEGORY_2',
  AOA_CATEGORY_1A = 'AOA_CATEGORY_1A',
  AOA_CATEGORY_1B = 'AOA_CATEGORY_1B',
  AOA_CATEGORY_2A = 'AOA_CATEGORY_2A',
  AOA_CATEGORY_2B = 'AOA_CATEGORY_2B',
  SPECIALTY = 'SPECIALTY',
  OTHER = 'OTHER'
}

export enum SpecialTopicType {
  OPIOID_EDUCATION = 'OPIOID_EDUCATION',
  PAIN_MANAGEMENT = 'PAIN_MANAGEMENT',
  CONTROLLED_SUBSTANCES = 'CONTROLLED_SUBSTANCES',
  ETHICS = 'ETHICS',
  CULTURAL_COMPETENCY = 'CULTURAL_COMPETENCY',
  MEDICAL_ERRORS = 'MEDICAL_ERRORS',
  INFECTION_CONTROL = 'INFECTION_CONTROL',
  DOMESTIC_VIOLENCE = 'DOMESTIC_VIOLENCE',
  HUMAN_TRAFFICKING = 'HUMAN_TRAFFICKING',
  CHILD_ABUSE = 'CHILD_ABUSE',
  END_OF_LIFE_CARE = 'END_OF_LIFE_CARE',
  RISK_MANAGEMENT = 'RISK_MANAGEMENT',
  SUICIDE_PREVENTION = 'SUICIDE_PREVENTION',
  IMPLICIT_BIAS = 'IMPLICIT_BIAS'
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export type DocumentSourceType = 'UPLOAD' | 'EMAIL' | 'PHOTO';

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  title: string | null;
  provider: string | null;
  credits: number | null;
  completedDate: string | null;
  category: CreditCategory | null;
  activityType: ActivityType | null;
  confidence: number;
  description: string | null;
  specialRequirements: SpecialTopicType[];
  topics: string[];
  notes: string | null;
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