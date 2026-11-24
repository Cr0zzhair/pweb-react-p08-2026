import { useMemo, useState } from 'react';
import { Scale, Sparkles } from 'lucide-react';
import type { ActiveTab, Application, JobListing } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_KAPTEN_SKILLS, INITIAL_APPLICATIONS } from './utils/seedData';
import {
  inferWorkModeFromLocation,
  isDuplicateApplication,
  normalizeText,
} from './utils/skillMatch';
import { detectInterviewConflicts, isGhostingRisk } from './utils/scheduleConflict';
import { Header } from './components/Header';
import { ConflictBanner } from './components/ConflictBanner';
import { JobExplorer } from './components/JobExplorer';
import { ManualApplicationModal } from './components/ManualApplicationModal';
import { WarRoomPipeline } from './components/WarRoomPipeline';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);

  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>(
    'aku-mw-magang:skills',
    DEFAULT_KAPTEN_SKILLS
  );
  const [applications, setApplications] = useLocalStorage<Application[]>(
    'aku-mw-magang:applications',
    INITIAL_APPLICATIONS
  );

  // Derived states (never duplicated in useState)
  const interviewConflicts = useMemo(
    () => detectInterviewConflicts(applications),
    [applications]
  );

  const stats = useMemo(() => {
    const total = applications.length;
    const responded = applications.filter(
      (a) =>
        a.status === 'SCREENING' ||
        a.status === 'INTERVIEW' ||
        a.status === 'OFFER' ||
        a.status === 'REJECTED'
    ).length;
    const interviewed = applications.filter(
      (a) => a.status === 'INTERVIEW' || a.status === 'OFFER'
    ).length;
    const ghostingCount = applications.filter((a) => isGhostingRisk(a)).length;
    const offerCount = applications.filter((a) => a.status === 'OFFER').length;

    return {
      total,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
      interviewRate: total > 0 ? Math.round((interviewed / total) * 100) : 0,
      ghostingCount,
      offerCount,
    };
  }, [applications]);

  // Handlers — strictly immutable updates
  const handleAddSkill = (newSkill: string) => {
    setKaptenSkills((prev) => {
      if (prev.some((s) => normalizeText(s) === normalizeText(newSkill))) {
        return prev;
      }
      return [...prev, newSkill];
    });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setKaptenSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveJobToWishlist = (job: JobListing) => {
    setApplications((prev) => {
      if (isDuplicateApplication(prev, job.company_name, job.title)) {
        return prev;
      }
      const nowIso = new Date().toISOString();
      const newApp: Application = {
        id: crypto.randomUUID(),
        company: job.company_name,
        role: job.title,
        workMode: inferWorkModeFromLocation(job.candidate_required_location),
        status: 'WISHLIST',
        requiredSkills: [...job.tags],
        lastUpdatedAt: nowIso,
        checklist: [
          {
            id: crypto.randomUUID(),
            text: `Riset profil & produk ${job.company_name}`,
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: 'Sesuaikan CV dengan required skills lowongan',
            done: false,
          },
        ],
        activityLogs: [
          {
            id: crypto.randomUUID(),
            timestamp: nowIso,
            message: 'Disimpan ke Wishlist dari Katalog Eksplorasi Lowongan',
          },
        ],
      };
      return [newApp, ...prev];
    });
  };

  const handleCreateManualApplication = (newApp: Application) => {
    setApplications((prev) => {
      if (isDuplicateApplication(prev, newApp.company, newApp.role)) {
        return prev;
      }
      return [newApp, ...prev];
    });
    setActiveTab('pipeline');
  };

  const handleSimulatePlus15Days = (appId: string) => {
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentMs = new Date(app.lastUpdatedAt).getTime();
        const shiftedIso = new Date(currentMs - fifteenDaysMs).toISOString();
        return {
          ...app,
          lastUpdatedAt: shiftedIso,
        };
      })
    );
  };

  const handleDeleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
  };

  return (
    <div className="page-field relative isolate flex min-h-svh flex-col overflow-x-clip">
      {/* Construction Grid Motif from cif.ucs.or.id */}
      <div
        className="construction-grid pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationCount={applications.length}
        offerCount={stats.offerCount}
        onOpenManualForm={() => setIsManualFormOpen(true)}
      />

      <main className="relative z-10 flex-1 py-6 md:py-10">
        <div className="mx-auto w-full max-w-[1440px] space-y-6 px-5 md:px-8 lg:px-16">
          {/* Hero Title Section (Compact CIF Display Style) */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/25 pb-5">
            <div>
              <p className="eyebrow text-[#9afff6]">
                {activeTab === 'explore' && '01 / Eksplorasi & Skill Match'}
                {activeTab === 'pipeline' && '02 / War Room Lamaran'}
                {activeTab === 'comparator' && '03 / Offer Comparator'}
              </p>
              <h1 className="brand-display mt-2 text-3xl text-white sm:text-4xl lg:text-5xl">
                {activeTab === 'explore' && (
                  <>
                    Eksplorasi <span className="text-[#9afff6]">Lowongan.</span>
                  </>
                )}
                {activeTab === 'pipeline' && (
                  <>
                    War Room <span className="text-[#9afff6]">Pipeline.</span>
                  </>
                )}
                {activeTab === 'comparator' && (
                  <>
                    Offer <span className="text-[#9afff6]">Comparator.</span>
                  </>
                )}
              </h1>
            </div>

            {/* Quick Stats Strip (Derived State) */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              <div className="panel rounded-[8px] px-3.5 py-2.5">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#9afff6] uppercase">
                  Total Lamaran
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-white">
                  {stats.total}
                </p>
              </div>
              <div className="panel rounded-[8px] px-3.5 py-2.5">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#9afff6] uppercase">
                  Response Rate
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-white">
                  {stats.responseRate}%
                </p>
              </div>
              <div className="panel rounded-[8px] px-3.5 py-2.5">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#9afff6] uppercase">
                  Interview Rate
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-white">
                  {stats.interviewRate}%
                </p>
              </div>
              <div
                className={`panel rounded-[8px] px-3.5 py-2.5 ${
                  stats.ghostingCount > 0 ? 'border-[#ffc1c1]/70' : ''
                }`}
              >
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#ffc1c1] uppercase">
                  Rawan Ghosting
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[#ffc1c1]">
                  {stats.ghostingCount}
                </p>
              </div>
              <div className="panel col-span-2 rounded-[8px] px-3.5 py-2.5 sm:col-span-1">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#6ee7b7] uppercase">
                  Offer Diterima
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[#6ee7b7]">
                  {stats.offerCount}
                </p>
              </div>
            </div>
          </div>

          {/* Global Interview Conflict Banner — Always visible regardless of active filters */}
          <ConflictBanner conflicts={interviewConflicts} />

          {/* Main Tab Content */}
          {activeTab === 'explore' && (
            <JobExplorer
              kaptenSkills={kaptenSkills}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              applications={applications}
              onSaveToWishlist={handleSaveJobToWishlist}
            />
          )}

          {activeTab === 'pipeline' && (
            <WarRoomPipeline
              applications={applications}
              kaptenSkills={kaptenSkills}
              onSimulatePlus15Days={handleSimulatePlus15Days}
              onDeleteApplication={handleDeleteApplication}
              onOpenManualForm={() => setIsManualFormOpen(true)}
            />
          )}

          {activeTab === 'comparator' && (
            <section className="panel rounded-[12px] p-10 text-center">
              <Scale className="mx-auto h-10 w-10 text-[#00f6ff]" />
              <p className="eyebrow mt-4 text-[#9afff6]">Fitur 7 — Tahap Berikutnya</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Offer Comparator siap dilanjutkan
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                Saat ini Fitur 1 (Profil Skill &amp; Eksplorasi), Fitur 2 (Form Manual), dan
                Fitur 3 (War Room Pipeline, Ghosting &amp; Bentrok) sudah aktif. Fitur 4–7
                dapat langsung kita tambahkan di tahap berikutnya.
              </p>
            </section>
          )}
        </div>
      </main>

      {/* Footer — CIF deep navy style */}
      <footer className="relative z-10 mt-10 border-t border-white/25 bg-[#003471]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-5 text-xs text-white/75 md:px-8 lg:px-16">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="h-4 w-4 text-[#00f6ff]" />
            <span>AKU MW MAGANG</span>
            <span className="text-white/40">/</span>
            <span className="font-normal text-white/75">Praktikum PemWeb Modul 5</span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">
            React 19 · TypeScript Strict · Custom Hooks
          </p>
        </div>
      </footer>

      {/* Feature 2: Manual Application Modal */}
      <ManualApplicationModal
        isOpen={isManualFormOpen}
        onClose={() => setIsManualFormOpen(false)}
        existingApplications={applications}
        onCreateApplication={handleCreateManualApplication}
      />
    </div>
  );
}

export default App;
