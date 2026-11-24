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
      className="animate-arrive rounded-[10px] border-2 border-[#ffc1c1] bg-[#003471]/95 px-5 py-4 shadow-[0_10px_28px_#00347166]"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#ffc1c1]/20 text-[#ffc1c1]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[#ffc1c1]">
            Peringatan Jadwal Interview Bentrok ({conflicts.length})
          </p>
          <ul className="mt-1.5 space-y-1 text-sm text-white">
            {conflicts.map((pair, idx) => (
              <li
                key={`${pair.appA.id}-${pair.appB.id}-${idx}`}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-relaxed"
              >
                <CalendarClock className="h-4 w-4 shrink-0 text-[#00f6ff]" />
                <span>
                  <strong className="text-[#9afff6]">{pair.appA.company}</strong> (
                  {formatInterviewDateTime(pair.appA.interviewDateTime ?? '')}) dan{' '}
                  <strong className="text-[#9afff6]">{pair.appB.company}</strong> (
                  {formatInterviewDateTime(pair.appB.interviewDateTime ?? '')}) berselisih{' '}
                  <strong className="text-[#ffc1c1]">{pair.diffMinutes} menit</strong> (&lt; 60
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
