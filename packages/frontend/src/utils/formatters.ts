import { US_STATES } from '../constants/states';

// Add a mapping of state support status
export const STATE_SUPPORT_STATUS: Record<string, boolean> = {
  'AL': true,
  'AK': true,
  'AZ': true,
  'AR': true,
  'CA': false,
  'CO': false,
  'CT': false,
  'DE': true,
  'FL': false,
  'GA': true,
  'HI': true,
  'ID': true,
  'IL': true,
  'IN': true,
  'IA': true,
  'KS': false,
  'KY': true,
  'LA': true,
  'ME': true,
  'MD': true,
  'MA': false,
  'MI': true,
  'MN': true,
  'MS': true,
  'MO': true,
  'MT': true,
  'NE': true,
  'NV': true,
  'NH': true,
  'NJ': true,
  'NM': true,
  'NY': true,
  'NC': true,
  'ND': true,
  'OH': true,
  'OK': true,
  'OR': true,
  'PA': true,
  'RI': true,
  'SC': true,
  'SD': true,
  'TN': true,
  'TX': true,
  'UT': true,
  'VT': true,
  'VA': true,
  'WA': true,
  'WV': true,
  'WI': true,
  'WY': true,
  // Territories
  'GU': true,
  'MP': true,
  'PR': true,
  'VI': true,
};

const LICENSE_TYPE_DISPLAY = {
  MD: 'Medical Doctor (MD)',
  DO: 'Doctor of Osteopathy (DO)',
  MD_DO: 'MD or DO',
};

export const formatLicenseType = (type: string): string => {
  return LICENSE_TYPE_DISPLAY[type] || type;
};

export const getStateName = (stateCode: string): string => {
  const state = US_STATES.find(s => s.value === stateCode);
  const name = state ? state.label : stateCode;
  const isSupported = STATE_SUPPORT_STATUS[stateCode];
  return isSupported ? name : `${name} (Coming Soon)`;
};

export const isStateSupported = (stateCode: string): boolean => {
  return STATE_SUPPORT_STATUS[stateCode] ?? false;
}; 