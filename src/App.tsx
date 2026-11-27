import { useEffect, useMemo, useRef, useState } from 'react';
import { Undo2, X } from 'lucide-react';
import type { ActiveTab, Application, ApplicationStatus, JobListing } from './types';
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
import {
  ApplicationDetailModal,
  type StatusTransitionPayload,
} from './components/ApplicationDetailModal';
import { OfferComparator } from './components/OfferComparator';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [pendingUndo, setPendingUndo] = useState<{
    application: Application;
    index: number;
  } | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (undoTimeoutRef.current !== null) {
        window.clearTimeout(undoTimeoutRef.current);
      }
    },
    []
  );

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
    const index = applications.findIndex((app) => app.id === appId);
    if (index < 0) return;
    const application = applications[index];

    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
    }
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    setPendingUndo({ application, index });
    undoTimeoutRef.current = window.setTimeout(() => {
      setPendingUndo(null);
      undoTimeoutRef.current = null;
    }, 5000);
    if (selectedAppId === appId) {
      setSelectedAppId(null);
    }
  };

  const handleUndoDelete = () => {
    if (!pendingUndo) return;
    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    setApplications((prev) => {
      if (prev.some((app) => app.id === pendingUndo.application.id)) return prev;
      const restored = [...prev];
      restored.splice(
        Math.min(pendingUndo.index, restored.length),
        0,
        pendingUndo.application
      );
      return restored;
    });
    setPendingUndo(null);
  };

  const handleTransitionStatus = (
    appId: string,
    nextStatus: ApplicationStatus,
    payload: StatusTransitionPayload
  ) => {
    const nowIso = new Date().toISOString();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const logMessage = `Status berubah: ${app.status} -> ${nextStatus}`;
        return {
          ...app,
          status: nextStatus,
          lastUpdatedAt: nowIso,
          ...(payload.cvVersion !== undefined ? { cvVersion: payload.cvVersion } : {}),
          ...(payload.appliedDate !== undefined ? { appliedDate: payload.appliedDate } : {}),
          ...(payload.interviewDateTime !== undefined
            ? { interviewDateTime: payload.interviewDateTime }
            : {}),
          ...(payload.salaryOffer !== undefined ? { salaryOffer: payload.salaryOffer } : {}),
          ...(payload.workMode !== undefined ? { workMode: payload.workMode } : {}),
          activityLogs: [
            ...app.activityLogs,
            {
              id: crypto.randomUUID(),
              timestamp: nowIso,
              message: logMessage,
            },
          ],
        };
      })
    );
  };

  const handleAddChecklistItem = (appId: string, text: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: [
            ...app.checklist,
            { id: crypto.randomUUID(), text, done: false },
          ],
        };
      })
    );
  };

  const handleToggleChecklistItem = (appId: string, itemId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: app.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  const handleDeleteChecklistItem = (appId: string, itemId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: app.checklist.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const handleAddActivityNote = (appId: string, message: string) => {
    const nowIso = new Date().toISOString();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          activityLogs: [
            ...app.activityLogs,
            { id: crypto.randomUUID(), timestamp: nowIso, message },
          ],
        };
      })
    );
  };

  const selectedApplication = useMemo(
    () => applications.find((app) => app.id === selectedAppId) ?? null,
    [applications, selectedAppId]
  );

  return (
    <div className="page-field relative flex min-h-svh flex-col overflow-x-clip">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationCount={applications.length}
        offerCount={stats.offerCount}
        onOpenManualForm={() => setIsManualFormOpen(true)}
      />

      <main className="relative z-10 flex-1 pb-8 pt-20 lg:ml-[248px] lg:pt-8">
        <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/20 pb-6">
            <div>
              <p className="eyebrow text-[#42F5D1]">
                {activeTab === 'explore' && '01 / Eksplorasi & Skill Match'}
                {activeTab === 'pipeline' && '02 / War Room Lamaran'}
                {activeTab === 'comparator' && '03 / Offer Comparator'}
              </p>
              <h1 className="brand-display mt-2 max-w-full text-2xl text-[#F8F5FF] md:text-3xl">
                {activeTab === 'explore' && (
                  <>
                    Eksplorasi <span className="text-[#42F5D1]">Lowongan.</span>
                  </>
                )}
                {activeTab === 'pipeline' && (
                  <>
                    War Room <span className="text-[#42F5D1]">Pipeline.</span>
                  </>
                )}
                {activeTab === 'comparator' && (
                  <>
                    Offer <span className="text-[#42F5D1]">Comparator.</span>
                  </>
                )}
              </h1>
            </div>

            {/* Quick Stats Strip (Derived State) */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-5">
              <div className="border-l border-white/20 px-3.5 py-1">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#42F5D1] uppercase">
                  Total Lamaran
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[#F8F5FF]">
                  {stats.total}
                </p>
              </div>
              <div className="border-l border-white/20 px-3.5 py-1">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#42F5D1] uppercase">
                  Response Rate
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[#F8F5FF]">
                  {stats.responseRate}%
                </p>
              </div>
              <div className="border-l border-white/20 px-3.5 py-1">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#42F5D1] uppercase">
                  Interview Rate
                </p>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[#F8F5FF]">
                  {stats.interviewRate}%
                </p>
              </div>
              <div
                className={`border-l border-white/20 px-3.5 py-1 ${
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
              <div className="col-span-2 border-l border-white/20 px-3.5 py-1 sm:col-span-1">
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
              onSelectApplication={setSelectedAppId}
              onOpenManualForm={() => setIsManualFormOpen(true)}
            />
          )}

          {activeTab === 'comparator' && (
            <OfferComparator
              applications={applications}
              kaptenSkills={kaptenSkills}
            />
          )}
        </div>
      </main>

      {/* Footer — CIF deep navy style */}
      <footer className="relative z-10 mt-10 border-t border-white/20 lg:ml-[248px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-[#C2B9D4] sm:px-6 lg:px-8">
          <p>AKU MW MAGANG / Praktikum PemWeb Modul 5</p>
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">
            React 19 · TypeScript Strict · Custom Hooks
          </p>
        </div>
      </footer>

      {pendingUndo && (
        <div
          role="status"
          className="undo-toast fixed right-4 bottom-4 z-[60] flex w-[min(100%-2rem,30rem)] items-center gap-3 border-l-2 border-[#42F5D1] p-4 text-[#F8F5FF]"
        >
          <span className="min-w-0 flex-1 text-sm">
            Lamaran <strong>{pendingUndo.application.company}</strong> dihapus.
          </span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="button button-primary min-h-10 shrink-0 px-3 py-2 text-sm"
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
          <button
            type="button"
            aria-label="Tutup notifikasi hapus"
            onClick={() => {
              if (undoTimeoutRef.current !== null) {
                window.clearTimeout(undoTimeoutRef.current);
                undoTimeoutRef.current = null;
              }
              setPendingUndo(null);
            }}
            className="button button-secondary min-h-10 shrink-0 px-2 py-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Feature 2: Manual Application Modal */}
      <ManualApplicationModal
        isOpen={isManualFormOpen}
        onClose={() => setIsManualFormOpen(false)}
        existingApplications={applications}
        onCreateApplication={handleCreateManualApplication}
      />

      {/* Feature 4 & 5: Application Detail & Interview Prep Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          kaptenSkills={kaptenSkills}
          onClose={() => setSelectedAppId(null)}
          onTransitionStatus={handleTransitionStatus}
          onAddChecklistItem={handleAddChecklistItem}
          onToggleChecklistItem={handleToggleChecklistItem}
          onDeleteChecklistItem={handleDeleteChecklistItem}
          onAddActivityNote={handleAddActivityNote}
        />
      )}
    </div>
  );
}

export default App;
