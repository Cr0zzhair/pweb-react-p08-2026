import { AlertTriangle, CalendarClock } from 'lucide-react';
import type { ScheduleConflictPair } from '../types';
import { formatInterviewDateTime } from '../utils/scheduleConflict';

interface ConflictBannerProps {
  conflicts: ScheduleConflictPair[];
}

export function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <div
      role="alert"
      className="animate-arrive border-2 border-[#FF8C9B] bg-[#211B36] px-5 py-4 shadow-[4px_4px_0_#090713]"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#FF8C9B] bg-[#FF8C9B]/15 text-[#FF8C9B]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[#FF8C9B]">
            Peringatan Jadwal Interview Bentrok ({conflicts.length})
          </p>
          <ul className="mt-1.5 space-y-1 text-sm text-[#F8F5FF]">
            {conflicts.map((pair, idx) => (
              <li
                key={`${pair.appA.id}-${pair.appB.id}-${idx}`}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-relaxed"
              >
                <CalendarClock className="h-4 w-4 shrink-0 text-[#42F5D1]" />
                <span>
                  <strong className="text-[#42F5D1]">{pair.appA.company}</strong> (
                  {formatInterviewDateTime(pair.appA.interviewDateTime ?? '')}) dan{' '}
                  <strong className="text-[#42F5D1]">{pair.appB.company}</strong> (
                  {formatInterviewDateTime(pair.appB.interviewDateTime ?? '')}) berselisih{' '}
                  <strong className="text-[#FF8C9B]">{pair.diffMinutes} menit</strong> (&lt; 60
                  menit).
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
