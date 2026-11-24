import { useEffect, useRef, useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { Application, WorkMode } from '../types';
import { isDuplicateApplication } from '../utils/skillMatch';

interface ManualApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingApplications: Application[];
  onCreateApplication: (newApp: Application) => void;
}

interface FormErrors {
  company?: string;
  role?: string;
  requiredSkills?: string;
  cvVersion?: string;
  appliedDate?: string;
}

export function ManualApplicationModal({
  isOpen,
  onClose,
  existingApplications,
  onCreateApplication,
}: ManualApplicationModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [initialStatus, setInitialStatus] = useState<'WISHLIST' | 'APPLIED'>('WISHLIST');
  const [requiredSkillsText, setRequiredSkillsText] = useState('');
  const [cvVersion, setCvVersion] = useState('');
  const [appliedDate, setAppliedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const companyRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);
  const skillsRef = useRef<HTMLInputElement | null>(null);
  const cvVersionRef = useRef<HTMLInputElement | null>(null);
  const appliedDateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setCompany('');
    setRole('');
    setWorkMode('Remote');
    setInitialStatus('WISHLIST');
    setRequiredSkillsText('');
    setCvVersion('');
    setAppliedDate(new Date().toISOString().slice(0, 10));
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();
    const parsedSkills = requiredSkillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!trimmedCompany) {
      nextErrors.company = 'Nama perusahaan wajib diisi.';
    }

    if (!trimmedRole) {
      nextErrors.role = 'Posisi / role wajib diisi.';
    }

    if (
      trimmedCompany &&
      trimmedRole &&
      isDuplicateApplication(existingApplications, trimmedCompany, trimmedRole)
    ) {
      nextErrors.company = `Lamaran untuk "${trimmedCompany} — ${trimmedRole}" sudah ada (duplikat ditolak).`;
    }

    if (parsedSkills.length === 0) {
      nextErrors.requiredSkills = 'Masukkan minimal 1 required skill (pisahkan dengan koma).';
    }

    if (initialStatus === 'APPLIED') {
      if (!cvVersion.trim()) {
        nextErrors.cvVersion = 'Versi CV wajib diisi untuk status APPLIED.';
      }
      if (!appliedDate.trim()) {
        nextErrors.appliedDate = 'Tanggal melamar wajib diisi untuk status APPLIED.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      // Auto-focus first invalid field using useRef
      if (nextErrors.company) {
        companyRef.current?.focus();
      } else if (nextErrors.role) {
        roleRef.current?.focus();
      } else if (nextErrors.requiredSkills) {
        skillsRef.current?.focus();
      } else if (nextErrors.cvVersion) {
        cvVersionRef.current?.focus();
      } else if (nextErrors.appliedDate) {
        appliedDateRef.current?.focus();
      }
      return;
    }

    const nowIso = new Date().toISOString();
    const newApplication: Application = {
      id: crypto.randomUUID(),
      company: trimmedCompany,
      role: trimmedRole,
      workMode,
      status: initialStatus,
      requiredSkills: parsedSkills,
      cvVersion: initialStatus === 'APPLIED' ? cvVersion.trim() : undefined,
      appliedDate: initialStatus === 'APPLIED' ? appliedDate : undefined,
      lastUpdatedAt: nowIso,
      checklist: [
        {
          id: crypto.randomUUID(),
          text: `Riset profil perusahaan ${trimmedCompany}`,
          done: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Sesuaikan CV dan portofolio dengan required skills',
          done: initialStatus === 'APPLIED',
        },
      ],
      activityLogs: [
        {
          id: crypto.randomUUID(),
          timestamp: nowIso,
          message:
            initialStatus === 'APPLIED'
              ? `Lamaran dicatat langsung sebagai APPLIED (CV: ${cvVersion.trim()})`
              : 'Lamaran ditambahkan ke Wishlist secara manual',
        },
      ],
    };

    onCreateApplication(newApplication);
    resetForm();
    onClose();
  };

  return (
    <div
      className="cif-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="panel-solid animate-arrive max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-[12px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <p className="eyebrow text-[#00f6ff]">Input Manual</p>
            <h2 id="manual-form-title" className="mt-1 text-2xl font-extrabold text-white">
              Catat Lamaran Baru
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup modal form"
            className="button button-secondary min-h-10 px-2.5 py-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {/* Perusahaan */}
          <div>
            <label htmlFor="manual-company" className="mb-1.5 block text-sm font-semibold">
              Perusahaan <span className="text-[#ffc1c1]">*</span>
            </label>
            <input
              ref={companyRef}
              id="manual-company"
              type="text"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
              }}
              placeholder="Contoh: Nusantara Cloud Tech"
              aria-invalid={errors.company ? 'true' : undefined}
              className="field"
            />
            {errors.company && (
              <p className="mt-1.5 text-xs font-semibold text-[#ffc1c1]">! {errors.company}</p>
            )}
          </div>

          {/* Posisi / Role */}
          <div>
            <label htmlFor="manual-role" className="mb-1.5 block text-sm font-semibold">
              Posisi / Role <span className="text-[#ffc1c1]">*</span>
            </label>
            <input
              ref={roleRef}
              id="manual-role"
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
              }}
              placeholder="Contoh: Frontend Engineering Intern"
              aria-invalid={errors.role ? 'true' : undefined}
              className="field"
            />
            {errors.role && (
              <p className="mt-1.5 text-xs font-semibold text-[#ffc1c1]">! {errors.role}</p>
            )}
          </div>

          {/* Mode Kerja & Status Awal */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="manual-workmode" className="mb-1.5 block text-sm font-semibold">
                Mode Kerja
              </label>
              <select
                id="manual-workmode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="field"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label htmlFor="manual-status" className="mb-1.5 block text-sm font-semibold">
                Status Awal
              </label>
              <select
                id="manual-status"
                value={initialStatus}
                onChange={(e) => {
                  const val = e.target.value as 'WISHLIST' | 'APPLIED';
                  setInitialStatus(val);
                  if (val === 'WISHLIST') {
                    setErrors((prev) => ({
                      ...prev,
                      cvVersion: undefined,
                      appliedDate: undefined,
                    }));
                  }
                }}
                className="field"
              >
                <option value="WISHLIST">WISHLIST</option>
                <option value="APPLIED">APPLIED</option>
              </select>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label htmlFor="manual-skills" className="mb-1.5 block text-sm font-semibold">
              Required Skills <span className="text-[#ffc1c1]">*</span>
            </label>
            <input
              ref={skillsRef}
              id="manual-skills"
              type="text"
              value={requiredSkillsText}
              onChange={(e) => {
                setRequiredSkillsText(e.target.value);
                if (errors.requiredSkills) {
                  setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
                }
              }}
              placeholder="Pisahkan dengan koma, cth: React, TypeScript, CSS, Git"
              aria-invalid={errors.requiredSkills ? 'true' : undefined}
              className="field"
            />
            {errors.requiredSkills && (
              <p className="mt-1.5 text-xs font-semibold text-[#ffc1c1]">
                ! {errors.requiredSkills}
              </p>
            )}
          </div>

          {/* Conditional Inputs when Status Awal === APPLIED */}
          {initialStatus === 'APPLIED' && (
            <div className="animate-arrive grid gap-4 rounded-[8px] border border-[#00f6ff]/50 bg-[#0a4fb9]/35 p-4 sm:grid-cols-2">
              <div>
                <label htmlFor="manual-cv" className="mb-1.5 block text-sm font-semibold">
                  Versi CV <span className="text-[#ffc1c1]">*</span>
                </label>
                <input
                  ref={cvVersionRef}
                  id="manual-cv"
                  type="text"
                  value={cvVersion}
                  onChange={(e) => {
                    setCvVersion(e.target.value);
                    if (errors.cvVersion) {
                      setErrors((prev) => ({ ...prev, cvVersion: undefined }));
                    }
                  }}
                  placeholder="cth: Kapten-CV-v2.pdf"
                  aria-invalid={errors.cvVersion ? 'true' : undefined}
                  className="field"
                />
                {errors.cvVersion && (
                  <p className="mt-1.5 text-xs font-semibold text-[#ffc1c1]">
                    ! {errors.cvVersion}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="manual-date" className="mb-1.5 block text-sm font-semibold">
                  Tanggal Melamar <span className="text-[#ffc1c1]">*</span>
                </label>
                <input
                  ref={appliedDateRef}
                  id="manual-date"
                  type="date"
                  value={appliedDate}
                  onChange={(e) => {
                    setAppliedDate(e.target.value);
                    if (errors.appliedDate) {
                      setErrors((prev) => ({ ...prev, appliedDate: undefined }));
                    }
                  }}
                  aria-invalid={errors.appliedDate ? 'true' : undefined}
                  className="field"
                />
                {errors.appliedDate && (
                  <p className="mt-1.5 text-xs font-semibold text-[#ffc1c1]">
                    ! {errors.appliedDate}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/20 pt-5">
            <button type="button" onClick={handleClose} className="button button-secondary">
              Batal
            </button>
            <button type="submit" className="button button-primary">
              <PlusCircle className="h-4 w-4" />
              Simpan Lamaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
