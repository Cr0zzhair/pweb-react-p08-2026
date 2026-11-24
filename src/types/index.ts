export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'GHOSTED';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string;
  salaryOffer?: number;
  lastUpdatedAt: string;
  checklist: ChecklistItem[];
  activityLogs: ActivityLog[];
}

export interface JobListing {
  id: number;
  title: string;
  company_name: string;
  category: string;
  candidate_required_location: string;
  salary: string;
  tags: string[];
  url?: string;
}

export type JobSource = 'live' | 'local';

export type ActiveTab = 'explore' | 'pipeline' | 'comparator';

export type PipelineSortOption = 'newest' | 'interview_soon' | 'offer_highest';

export interface SkillMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ScheduleConflictPair {
  appA: Application;
  appB: Application;
  diffMinutes: number;
}
