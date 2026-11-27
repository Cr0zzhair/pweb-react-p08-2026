import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquarePlus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type {
  Application,
  ApplicationStatus,
  WorkMode,
} from '../types';
import { getAllowedTransitions, STATUS_LABELS } from '../utils/stateMachine';
import { calculateSkillMatch } from '../utils/skillMatch';
import {
  formatInterviewDateTime,
  formatRupiah,
} from '../utils/scheduleConflict';
import { InterviewPrepTimer } from './InterviewPrepTimer';

export interface StatusTransitionPayload {
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string;
  salaryOffer?: number;
  workMode?: WorkMode;
}

interface ApplicationDetailModalProps {
  application: Application;
  kaptenSkills: string[];
  onClose: () => void;
  onTransitionStatus: (
    appId: string,
    nextStatus: ApplicationStatus,
    payload: StatusTransitionPayload
  ) => void;
  onAddChecklistItem: (appId: string, text: string) => void;
  onToggleChecklistItem: (appId: string, itemId: string) => void;
  onDeleteChecklistItem: (appId: string, itemId: string) => void;
  onAddActivityNote: (appId: string, message: string) => void;
}

type DetailTab = 'detail' | 'interview';

export function ApplicationDetailModal({
  application,
  kaptenSkills,
  onClose,
  onTransitionStatus,
  onAddChecklistItem,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onAddActivityNote,
}: ApplicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('detail');

  // State Machine transition form state
  const allowedTransitions = getAllowedTransitions(application.status);
  const [selectedNextStatus, setSelectedNextStatus] =
    useState<ApplicationStatus | null>(null);
  const [cvVersion, setCvVersion] = useState(application.cvVersion ?? '');
  const [appliedDate, setAppliedDate] = useState(
    application.appliedDate ?? new Date().toISOString().slice(0, 10)
  );
  const [interviewDateTime, setInterviewDateTime] = useState(
    application.interviewDateTime ?? ''
  );
  const [salaryOffer, setSalaryOffer] = useState(
    application.salaryOffer ? String(application.salaryOffer) : ''
  );
  const [workMode, setWorkMode] = useState<WorkMode>(application.workMode);
  const [transitionError, setTransitionError] = useState('');

  // Checklist & Activity Log inputs
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const match = calculateSkillMatch(kaptenSkills, application.requiredSkills);
  const doneCount = application.checklist.filter((item) => item.done).length;
  const totalChecklist = application.checklist.length;
  const checklistPercent =
    totalChecklist > 0 ? Math.round((doneCount / totalChecklist) * 100) : 0;

  const handleSelectTargetStatus = (status: ApplicationStatus) => {
    setSelectedNextStatus(status);
    setTransitionError('');
  };

  const handleConfirmTransition = () => {
    if (!selectedNextStatus) return;

    if (selectedNextStatus === 'APPLIED') {
      if (!cvVersion.trim()) {
        setTransitionError('Versi CV wajib diisi sebelum pindah ke APPLIED.');
        return;
      }
      if (!appliedDate) {
        setTransitionError('Tanggal melamar wajib diisi.');
        return;
      }
      onTransitionStatus(application.id, selectedNextStatus, {
        cvVersion: cvVersion.trim(),
        appliedDate,
      });
    } else if (selectedNextStatus === 'INTERVIEW') {
      if (!interviewDateTime) {
        setTransitionError('Jadwal interview wajib diisi.');
        return;
      }
      onTransitionStatus(application.id, selectedNextStatus, {
        interviewDateTime,
      });
    } else if (selectedNextStatus === 'OFFER') {
      const parsedSalary = Number(salaryOffer);
      if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) {
        setTransitionError('Nominal gaji / uang saku harus lebih dari 0.');
        return;
      }
      onTransitionStatus(application.id, selectedNextStatus, {
        salaryOffer: parsedSalary,
        workMode,
      });
    } else {
      onTransitionStatus(application.id, selectedNextStatus, {});
    }

    setSelectedNextStatus(null);
    setTransitionError('');
  };

  const handleAddChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newChecklistText.trim();
    if (!trimmed) return;
    onAddChecklistItem(application.id, trimmed);
    setNewChecklistText('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNoteText.trim();
    if (!trimmed) return;
    onAddActivityNote(application.id, trimmed);
    setNewNoteText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="detail-modal flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/20 px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-[#00f6ff]">
                Status: {STATUS_LABELS[application.status]}
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#9afff6]">
                Skill Match {match.score}%
              </span>
            </div>
            <h2
              id="detail-modal-title"
              className="mt-1 truncate text-xl font-extrabold text-white"
            >
              {application.company} — {application.role}
            </h2>
            <p className="mt-0.5 text-xs text-white/75">
              Mode: {application.workMode}
              {application.cvVersion ? ` • CV: ${application.cvVersion}` : ''}
              {application.interviewDateTime
                ? ` • Interview: ${formatInterviewDateTime(
                    application.interviewDateTime
                  )}`
                : ''}
              {typeof application.salaryOffer === 'number' &&
              application.salaryOffer > 0
                ? ` • Offer: ${formatRupiah(application.salaryOffer)}`
                : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail lamaran"
            className="rounded-[8px] border border-white/30 p-2 text-white/80 transition-colors hover:border-[#00f6ff] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/20 bg-[#002859] px-6 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`cursor-pointer rounded-[8px] px-4 py-1.5 text-sm font-bold transition-colors ${
              activeTab === 'detail'
                ? 'bg-[#00f6ff] text-[#003471]'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Detail, State Machine & Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`cursor-pointer rounded-[8px] px-4 py-1.5 text-sm font-bold transition-colors ${
              activeTab === 'interview'
                ? 'bg-[#00f6ff] text-[#003471]'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Latihan Interview
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {activeTab === 'interview' ? (
            <InterviewPrepTimer />
          ) : (
            <>
              {/* State Machine Section */}
              <section className="rounded-[10px] border border-white/25 bg-[#002859]/70 p-4">
                <p className="eyebrow text-[#9afff6]">
                  Transisi Status (State Machine)
                </p>

                {allowedTransitions.length === 0 ? (
                  <p className="mt-2 text-sm text-white/80">
                    Status{' '}
                    <strong className="text-[#00f6ff]">
                      {STATUS_LABELS[application.status]}
                    </strong>{' '}
                    bersifat <strong>FINAL</strong> dan tidak dapat dipindahkan ke
                    status lain.
                  </p>
                ) : (
                  <div className="mt-3 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-white/75">
                        Pindahkan status ke:
                      </span>
                      {allowedTransitions.map((target) => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => handleSelectTargetStatus(target)}
                          className={`cursor-pointer rounded-[8px] border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                            selectedNextStatus === target
                              ? 'border-[#00f6ff] bg-[#00f6ff] text-[#003471]'
                              : 'border-white/40 bg-[#003471] text-white hover:border-[#9afff6]'
                          }`}
                        >
                          {STATUS_LABELS[target]}
                        </button>
                      ))}
                    </div>

                    {selectedNextStatus && (
                      <div className="space-y-3 rounded-[8px] border border-[#00f6ff]/40 bg-[#003471] p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#9afff6]">
                          <span>{STATUS_LABELS[application.status]}</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="text-[#00f6ff]">
                            {STATUS_LABELS[selectedNextStatus]}
                          </span>
                        </div>

                        {selectedNextStatus === 'APPLIED' && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-white/85">
                                Versi CV *
                              </label>
                              <input
                                type="text"
                                value={cvVersion}
                                onChange={(e) => setCvVersion(e.target.value)}
                                placeholder="Contoh: Kapten-CV-v2.pdf"
                                className="field min-h-10 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-white/85">
                                Tanggal Melamar *
                              </label>
                              <input
                                type="date"
                                value={appliedDate}
                                onChange={(e) => setAppliedDate(e.target.value)}
                                className="field min-h-10 text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {selectedNextStatus === 'INTERVIEW' && (
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-white/85">
                              Jadwal Interview (YYYY-MM-DDTHH:mm) *
                            </label>
                            <input
                              type="datetime-local"
                              value={interviewDateTime}
                              onChange={(e) =>
                                setInterviewDateTime(e.target.value)
                              }
                              className="field min-h-10 text-sm"
                            />
                          </div>
                        )}

                        {selectedNextStatus === 'OFFER' && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-white/85">
                                Uang Saku / Gaji (Rp) *
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={salaryOffer}
                                onChange={(e) => setSalaryOffer(e.target.value)}
                                placeholder="Contoh: 5500000"
                                className="field min-h-10 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-white/85">
                                Mode Kerja *
                              </label>
                              <select
                                value={workMode}
                                onChange={(e) =>
                                  setWorkMode(e.target.value as WorkMode)
                                }
                                className="field min-h-10 text-sm"
                              >
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Onsite">Onsite</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {transitionError && (
                          <p className="text-xs font-semibold text-[#ffc1c1]">
                            ! {transitionError}
                          </p>
                        )}

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNextStatus(null);
                              setTransitionError('');
                            }}
                            className="button button-secondary min-h-9 px-3.5 py-1.5 text-xs"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmTransition}
                            className="button button-primary min-h-9 px-4 py-1.5 text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Konfirmasi Pindah Status
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Checklist & Activity Log Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Nested Checklist */}
                <section className="space-y-3 rounded-[10px] border border-white/25 bg-[#002859]/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-[#9afff6]">Daftar Persiapan</p>
                    <span className="text-xs font-bold tabular-nums text-[#00f6ff]">
                      {doneCount}/{totalChecklist} selesai
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full bg-[#00f6ff] transition-all duration-300"
                      style={{ width: `${checklistPercent}%` }}
                    />
                  </div>

                  <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {application.checklist.length === 0 ? (
                      <li className="py-4 text-center text-xs text-white/60">
                        Belum ada item persiapan.
                      </li>
                    ) : (
                      application.checklist.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded-[8px] border border-white/15 bg-[#003471] px-3 py-2"
                        >
                          <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-sm">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() =>
                                onToggleChecklistItem(application.id, item.id)
                              }
                              className="check-control shrink-0"
                            />
                            <span
                              className={`truncate ${
                                item.done
                                  ? 'text-white/50 line-through'
                                  : 'text-white'
                              }`}
                            >
                              {item.text}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              onDeleteChecklistItem(application.id, item.id)
                            }
                            aria-label={`Hapus item ${item.text}`}
                            className="shrink-0 p-1 text-white/50 transition-colors hover:text-[#ffc1c1]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>

                  <form
                    onSubmit={handleAddChecklistSubmit}
                    className="flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      placeholder="Tambah tugas persiapan baru..."
                      className="field min-h-10 flex-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="button button-primary min-h-10 px-3.5 py-2 text-xs"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah
                    </button>
                  </form>
                </section>

                {/* Activity Log */}
                <section className="space-y-3 rounded-[10px] border border-white/25 bg-[#002859]/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-[#9afff6]">Riwayat Aktivitas</p>
                    <span className="text-xs text-white/65 tabular-nums">
                      {application.activityLogs.length} catatan
                    </span>
                  </div>

                  <ul className="max-h-60 space-y-3 overflow-y-auto border-l border-white/30 pl-4">
                    {[...application.activityLogs].reverse().map((log) => (
                      <li key={log.id} className="relative text-xs">
                        <span
                          aria-hidden="true"
                          className="absolute top-1 -left-[21px] h-2 w-2 bg-[#00f6ff]"
                        />
                        <p className="flex items-center gap-1 text-[11px] text-white/60">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="mt-0.5 text-sm text-white">
                          {log.message}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <form
                    onSubmit={handleAddNoteSubmit}
                    className="flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Tambah catatan manual..."
                      className="field min-h-10 flex-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="button button-secondary min-h-10 px-3.5 py-2 text-xs"
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      Catat
                    </button>
                  </form>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
