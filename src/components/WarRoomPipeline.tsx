import { useMemo, useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  Eye,
  FileText,
  Ghost,
  MapPin,
  Plus,
  Search,
  Trash2,
  Wallet,
} from 'lucide-react';
import type {
  Application,
  ApplicationStatus,
  PipelineSortOption,
} from '../types';
import { STATUS_LABELS } from '../utils/stateMachine';
import { calculateSkillMatch, getInitials } from '../utils/skillMatch';
import {
  formatInterviewDateTime,
  formatRupiah,
  getDaysSinceUpdate,
  isGhostingRisk,
} from '../utils/scheduleConflict';

interface WarRoomPipelineProps {
  applications: Application[];
  kaptenSkills: string[];
  onSimulatePlus15Days: (appId: string) => void;
  onDeleteApplication: (appId: string) => void;
  onSelectApplication: (appId: string) => void;
  onOpenManualForm: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'GHOSTED',
];

function getStatusBadgeStyle(status: ApplicationStatus): string {
  switch (status) {
    case 'WISHLIST':
      return 'border-white/40 bg-white/10 text-white';
    case 'APPLIED':
      return 'border-[#00aeff]/60 bg-[#0059ff]/30 text-[#9afff6]';
    case 'SCREENING':
      return 'border-[#00f6ff]/70 bg-[#01c7e5]/25 text-[#00f6ff]';
    case 'INTERVIEW':
      return 'border-[#fbbf24]/70 bg-[#b45309]/40 text-[#fde68a]';
    case 'OFFER':
      return 'border-[#34d399]/70 bg-[#065f46]/60 text-[#6ee7b7]';
    case 'REJECTED':
      return 'border-[#ffc1c1]/70 bg-[#7f1d1d]/60 text-[#ffc1c1]';
    case 'GHOSTED':
      return 'border-[#c8d0ff]/50 bg-[#5502c8]/40 text-[#c8d0ff]';
  }
}

export function WarRoomPipeline({
  applications,
  kaptenSkills,
  onSimulatePlus15Days,
  onDeleteApplication,
  onSelectApplication,
  onOpenManualForm,
}: WarRoomPipelineProps) {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [onlyGhostingRisk, setOnlyGhostingRisk] = useState(false);
  const [sortBy, setSortBy] = useState<PipelineSortOption>('newest');

  const filteredApplications = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    const list = applications.filter((app) => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      if (onlyGhostingRisk && !isGhostingRisk(app)) return false;
      if (q) {
        const hitCompany = app.company.toLowerCase().includes(q);
        const hitRole = app.role.toLowerCase().includes(q);
        const hitCv = (app.cvVersion ?? '').toLowerCase().includes(q);
        if (!hitCompany && !hitRole && !hitCv) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
      }
      if (sortBy === 'interview_soon') {
        const timeA = a.interviewDateTime
          ? new Date(a.interviewDateTime).getTime()
          : Number.POSITIVE_INFINITY;
        const timeB = b.interviewDateTime
          ? new Date(b.interviewDateTime).getTime()
          : Number.POSITIVE_INFINITY;
        return timeA - timeB;
      }
      // offer_highest
      return (b.salaryOffer ?? 0) - (a.salaryOffer ?? 0);
    });
  }, [applications, searchText, statusFilter, onlyGhostingRisk, sortBy]);

  return (
    <section className="space-y-5">
      {/* Filter & Sorting Controls */}
      <div className="panel rounded-[12px] p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_210px_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Cari perusahaan, posisi, atau versi CV..."
              aria-label="Cari lamaran di pipeline"
              className="field pl-10"
            />
          </div>

          {/* Filter Status */}
          <select
            aria-label="Filter status lamaran"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'ALL' | ApplicationStatus)
            }
            className="field"
          >
            <option value="ALL">Semua Status</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {STATUS_LABELS[st]}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            aria-label="Urutkan lamaran"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as PipelineSortOption)}
            className="field"
          >
            <option value="newest">Terbaru Diupdate</option>
            <option value="interview_soon">Jadwal Interview Terdekat</option>
            <option value="offer_highest">Offer Tertinggi</option>
          </select>

          {/* Toggle Hanya Rawan Ghosting */}
          <label
            className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[8px] border px-3.5 text-sm font-semibold transition-colors ${
              onlyGhostingRisk
                ? 'border-[#ffc1c1] bg-[#7f1d1d]/60 text-[#ffc1c1]'
                : 'border-white/40 bg-[#003471] text-white hover:border-[#9afff6]'
            }`}
          >
            <input
              type="checkbox"
              checked={onlyGhostingRisk}
              onChange={(e) => setOnlyGhostingRisk(e.target.checked)}
              className="check-control"
            />
            <Ghost className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Hanya Rawan Ghosting</span>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3 text-xs text-white/75">
          <span>
            Menampilkan{' '}
            <strong className="text-[#9afff6] tabular-nums">
              {filteredApplications.length}
            </strong>{' '}
            dari <strong className="tabular-nums">{applications.length}</strong> total
            lamaran Kapten.
          </span>
          {(searchText || statusFilter !== 'ALL' || onlyGhostingRisk) && (
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                setStatusFilter('ALL');
                setOnlyGhostingRisk(false);
              }}
              className="cursor-pointer font-semibold text-[#00f6ff] underline underline-offset-4 hover:text-white"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 ? (
        <div className="panel rounded-[12px] p-10 text-center">
          <Briefcase className="mx-auto h-9 w-9 text-[#9afff6]" />
          <h3 className="mt-3 text-lg font-bold text-white">
            {applications.length === 0
              ? 'Belum ada lamaran di War Room'
              : 'Tidak ada lamaran sesuai filter aktif'}
          </h3>
          <p className="mt-1 text-sm text-white/75">
            {applications.length === 0
              ? 'Simpan lowongan dari Eksplorasi Lowongan atau catat lamaran manual.'
              : 'Coba longgarkan filter status atau matikan toggle Rawan Ghosting.'}
          </p>
          {applications.length === 0 && (
            <button
              type="button"
              onClick={onOpenManualForm}
              className="button button-primary mt-5"
            >
              <Plus className="h-4 w-4" />
              Catat Lamaran Manual
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredApplications.map((app) => {
            const match = calculateSkillMatch(kaptenSkills, app.requiredSkills);
            const ghostRisk = isGhostingRisk(app);
            const daysSinceUpdate = getDaysSinceUpdate(app.lastUpdatedAt);
            const doneCount = app.checklist.filter((item) => item.done).length;
            const totalChecklist = app.checklist.length;
            const canSimulateGhost =
              app.status === 'APPLIED' || app.status === 'SCREENING';

            return (
              <article
                key={app.id}
                className={`panel flex flex-col justify-between rounded-[12px] p-5 transition-colors hover:border-[#9afff6]/60 ${
                  ghostRisk ? 'border-[#ffc1c1]/75' : ''
                }`}
              >
                <div>
                  {/* Header: Company + Status Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-white/40 bg-[#003471] text-sm font-extrabold italic text-[#00f6ff]"
                      >
                        {getInitials(app.company)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-white">
                          {app.company}
                        </h3>
                        <p className="truncate text-sm font-medium text-[#9afff6]">
                          {app.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${getStatusBadgeStyle(
                          app.status
                        )}`}
                      >
                        {STATUS_LABELS[app.status]}
                      </span>
                      {ghostRisk && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#ffc1c1] bg-[#7f1d1d]/90 px-2.5 py-0.5 text-[11px] font-bold text-[#ffc1c1]">
                          <Ghost className="h-3 w-3" />
                          Rawan Ghosting ({daysSinceUpdate}h)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-[8px] border border-white/15 bg-[#003471]/60 p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-white/85">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#00f6ff]" />
                      <span>Mode: {app.workMode}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/85">
                      <CheckSquare className="h-3.5 w-3.5 shrink-0 text-[#00f6ff]" />
                      <span className="tabular-nums">
                        Checklist: {doneCount}/{totalChecklist}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/85">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-[#9afff6]" />
                      <span className="truncate">
                        CV: {app.cvVersion ? app.cvVersion : 'Belum dikirim'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-[#9afff6]">
                      <span className="tabular-nums">Skill Match: {match.score}%</span>
                    </div>

                    {app.interviewDateTime && (
                      <div className="col-span-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[#fde68a]">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          Interview: {formatInterviewDateTime(app.interviewDateTime)}
                        </span>
                      </div>
                    )}

                    {typeof app.salaryOffer === 'number' && app.salaryOffer > 0 && (
                      <div className="col-span-2 flex items-center gap-1.5 border-t border-white/10 pt-2 font-bold text-[#6ee7b7]">
                        <Wallet className="h-3.5 w-3.5 shrink-0" />
                        <span>Offer: {formatRupiah(app.salaryOffer)} / bulan</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/65">
                    <Clock className="h-3.5 w-3.5" />
                    Update {daysSinceUpdate} hari lalu
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectApplication(app.id)}
                      className="button button-primary min-h-9 px-3 py-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Detail &amp; Prep
                    </button>

                    {canSimulateGhost && (
                      <button
                        type="button"
                        onClick={() => onSimulatePlus15Days(app.id)}
                        className="button button-secondary min-h-9 px-3 py-1.5 text-xs"
                        title="Mundurkan lastUpdatedAt 15 hari untuk menguji badge Rawan Ghosting"
                      >
                        <Ghost className="h-3.5 w-3.5 text-[#ffc1c1]" />
                        Simulasi +15 Hari
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteApplication(app.id)}
                      aria-label={`Hapus lamaran ${app.company}`}
                      className="button button-quiet min-h-9 border-[#ffc1c1]/40 px-2.5 py-1.5 text-xs text-[#ffc1c1] hover:border-[#ffc1c1] hover:bg-[#ffc1c1]/15"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
