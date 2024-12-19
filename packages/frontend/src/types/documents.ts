export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type DocumentSourceType = 'UPLOAD' | 'EMAIL' | 'PHOTO';

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
  description?: string;
  notes?: string;
  status: ProcessingStatus;
  error?: string;
  createdAt: string;
  updatedAt: string;
} 