import type { Application, ScheduleConflictPair } from '../types';

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;

export function isGhostingRisk(app: Application, nowMs: number = Date.now()): boolean {
  if (app.status !== 'APPLIED' && app.status !== 'SCREENING') {
    return false;
  }
  const updatedMs = new Date(app.lastUpdatedAt).getTime();
  if (Number.isNaN(updatedMs)) return false;
  return nowMs - updatedMs > FOURTEEN_DAYS_MS;
}

export function getDaysSinceUpdate(
  isoDate: string,
  nowMs: number = Date.now()
): number {
  const updatedMs = new Date(isoDate).getTime();
  if (Number.isNaN(updatedMs)) return 0;
  return Math.max(0, Math.floor((nowMs - updatedMs) / (24 * 60 * 60 * 1000)));
}

export function detectInterviewConflicts(
  applications: Application[]
): ScheduleConflictPair[] {
  const interviews = applications.filter(
    (app) => app.status === 'INTERVIEW' && Boolean(app.interviewDateTime)
  );

  const conflicts: ScheduleConflictPair[] = [];

  for (let i = 0; i < interviews.length; i++) {
    const appA = interviews[i];
    const timeA = new Date(appA.interviewDateTime ?? '').getTime();
    if (Number.isNaN(timeA)) continue;

    for (let j = i + 1; j < interviews.length; j++) {
      const appB = interviews[j];
      const timeB = new Date(appB.interviewDateTime ?? '').getTime();
      if (Number.isNaN(timeB)) continue;

      const diffMs = Math.abs(timeA - timeB);
      if (diffMs < SIXTY_MINUTES_MS) {
        conflicts.push({
          appA,
          appB,
          diffMinutes: Math.round(diffMs / 60000),
        });
      }
    }
  }

  return conflicts;
}

export function formatInterviewDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
