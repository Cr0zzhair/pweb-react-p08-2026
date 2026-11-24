import { useState } from 'react';
import { Cpu, Database, Globe, Plus, X } from 'lucide-react';
import type { JobSource } from '../types';
import { normalizeText } from '../utils/skillMatch';

interface SkillProfileSidebarProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  jobSource: JobSource;
  onChangeJobSource: (source: JobSource) => void;
}

export function SkillProfileSidebar({
  skills,
  onAddSkill,
  onRemoveSkill,
  jobSource,
  onChangeJobSource,
}: SkillProfileSidebarProps) {
  const [skillInput, setSkillInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = skillInput.trim();

    if (!trimmed) {
      setErrorMsg('Nama skill tidak boleh kosong.');
      return;
    }

    const exists = skills.some((s) => normalizeText(s) === normalizeText(trimmed));
    if (exists) {
      setErrorMsg(`Skill "${trimmed}" sudah ada di profil Kapten.`);
      return;
    }

    onAddSkill(trimmed);
    setSkillInput('');
    setErrorMsg(null);
  };

  return (
    <aside className="space-y-6">
      {/* Profil Skill Kapten */}
      <section className="panel rounded-[12px] p-5 md:p-6">
        <div className="flex items-center gap-2 text-[#00f6ff]">
          <Cpu className="h-4 w-4" />
          <p className="eyebrow">Profil Skill Kapten</p>
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          Skill &amp; Tech Stack
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/75">
          Digunakan secara langsung untuk menghitung persentase kecocokan (Match Score %) setiap
          lowongan.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-2.5" noValidate>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Tambah skill (cth: Docker)..."
              aria-label="Tambah skill baru"
              aria-invalid={errorMsg ? 'true' : undefined}
              className="field min-h-11 flex-1"
            />
            <button
              type="submit"
              className="button button-primary min-h-11 shrink-0 px-4 text-sm"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </button>
          </div>
          {errorMsg && (
            <p role="alert" className="text-xs font-semibold text-[#ffc1c1]">
              ! {errorMsg}
            </p>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-xs text-white/60">
              Belum ada skill. Tambahkan minimal 1 skill untuk menghitung Match Score.
            </p>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#00f6ff]/50 bg-[#003471] px-2.5 py-1 text-xs font-semibold text-[#9afff6]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  aria-label={`Hapus skill ${skill}`}
                  className="ml-0.5 cursor-pointer rounded p-0.5 text-white/70 transition-colors hover:bg-white/15 hover:text-[#ffc1c1]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </section>

      {/* Sumber Data Lowongan */}
      <section className="panel rounded-[12px] p-5 md:p-6">
        <p className="eyebrow text-[#9afff6]">Sumber Data Lowongan</p>
        <div className="mt-3 space-y-2.5">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-3 transition-colors ${
              jobSource === 'live'
                ? 'border-[#00f6ff] bg-[#003471]'
                : 'border-white/20 bg-[#003471]/40 hover:border-white/40'
            }`}
          >
            <input
              type="radio"
              name="job-source"
              value="live"
              checked={jobSource === 'live'}
              onChange={() => onChangeJobSource('live')}
              className="check-control mt-0.5"
            />
            <div className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Globe className="h-4 w-4 text-[#00f6ff]" />
                Remotive API (Live)
              </span>
              <span className="mt-0.5 block text-xs text-white/70">
                30 lowongan software-dev langsung dari Remotive API.
              </span>
            </div>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-3 transition-colors ${
              jobSource === 'local'
                ? 'border-[#00f6ff] bg-[#003471]'
                : 'border-white/20 bg-[#003471]/40 hover:border-white/40'
            }`}
          >
            <input
              type="radio"
              name="job-source"
              value="local"
              checked={jobSource === 'local'}
              onChange={() => onChangeJobSource('local')}
              className="check-control mt-0.5"
            />
            <div className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Database className="h-4 w-4 text-[#9afff6]" />
                Dataset Magang ID (Lokal)
              </span>
              <span className="mt-0.5 block text-xs text-white/70">
                15 lowongan magang tech Indonesia dari fallback lokal.
              </span>
            </div>
          </label>
        </div>
      </section>
    </aside>
  );
}
