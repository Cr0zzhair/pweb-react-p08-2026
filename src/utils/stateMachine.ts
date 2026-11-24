import type { ApplicationStatus } from '../types';

export const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ['APPLIED'],
  APPLIED: ['SCREENING', 'REJECTED', 'GHOSTED'],
  SCREENING: ['INTERVIEW', 'REJECTED', 'GHOSTED'],
  INTERVIEW: ['OFFER', 'REJECTED', 'GHOSTED'],
  GHOSTED: ['SCREENING'],
  OFFER: [],
  REJECTED: [],
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  GHOSTED: 'Ghosted',
};

export function getAllowedTransitions(current: ApplicationStatus): ApplicationStatus[] {
  return STATUS_TRANSITIONS[current];
}

export function canTransitionStatus(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}
