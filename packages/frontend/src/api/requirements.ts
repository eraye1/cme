import { api } from '../api';

export type LicenseType = 'MD' | 'DO' | 'MD_DO';

export interface RequirementCategory {
  id: string;
  categoryName: string;
  requiredHours: number;
  maximumHours?: number;
  annualLimit?: number;
  notes?: string;
}

export interface SpecialRequirement {
  id: string;
  topic: string;
  requiredHours: number;
  description: string;
  effectiveDate?: string;
  notes?: string;
  oneTime: boolean;
}

export interface LegalCitation {
  id: string;
  citation: string;
  url?: string;
}

export interface JurisdictionRequirement {
  id: string;
  state: string;
  licenseType: LicenseType;
  verified: boolean;
  live: boolean;
  requiresCme: boolean;
  hasSpecificContent: boolean;
  totalHours: number;
  cycleLength: number;
  requirements: RequirementCategory[];
  specialRequirements: SpecialRequirement[];
  legalCitations: LegalCitation[];
  createdAt: string;
  updatedAt: string;
}

export const requirementsApi = {
  getAll: () => api.get<JurisdictionRequirement[]>('/requirements').then(res => res.data),
  
  getByState: (state: string, licenseType: LicenseType) => 
    api.get<JurisdictionRequirement>(`/requirements/${state}/${licenseType}`).then(res => res.data),
}; 