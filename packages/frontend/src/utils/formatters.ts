import { US_STATES } from '../constants/states';

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
  return state ? state.label : stateCode;
}; 