import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookmarkPlus,
  ChevronDown,
  Database,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Wallet,
} from 'lucide-react';
import type { Application, JobListing, JobSource } from '../types';
import { fetchJobs } from '../services/jobService';
import { useDebounce } from '../hooks/useDebounce';
import {
  calculateSkillMatch,
  isDuplicateApplication,
} from '../utils/skillMatch';
import { SkillProfileSidebar } from './SkillProfileSidebar';

interface JobExplorerProps {
  kaptenSkills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  applications: Application[];
  onSaveToWishlist: (job: JobListing) => void;
}

type JobSortOption = 'match_desc' | 'match_asc' | 'title_asc';

function matchBadgeColors(score: number): string {
  if (score >= 70) return 'bg-green-400/10 text-green-300';
  if (score >= 40) return 'bg-yellow-400/10 text-yellow-300';
  return 'bg-red-400/10 text-red-300';
}

export function JobExplorer({
  kaptenSkills,
  onAddSkill,
  onRemoveSkill,
  applications,
  onSaveToWishlist,
}: JobExplorerProps) {
  const [jobSource, setJobSource] = useState<JobSource>('live');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState<number>(0);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<JobSortOption>('match_desc');
  const [showPreferences, setShowPreferences] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const debouncedKeyword = useDebounce(searchKeyword, 400);

  // Bonus keyboard shortcut: press "/" to focus search bar via useRef
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch data with useEffect + fetch() + AbortController
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadJobs() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchJobs(jobSource, controller.signal);
        if (isMounted) {
          setJobs(result);
          setSelectedCategory('ALL');
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan saat mengambil data lowongan.';
          setError(message);
          setJobs([]);
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [jobSource, retryToken]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    for (const job of jobs) {
      if (job.category) unique.add(job.category);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const enrichedAndFilteredJobs = useMemo(() => {
    const q = debouncedKeyword.trim().toLowerCase();

    const mapped = jobs
      .map((job) => ({
        job,
        match: calculateSkillMatch(kaptenSkills, job.tags),
        alreadyApplied: isDuplicateApplication(
          applications,
          job.company_name,
          job.title
        ),
      }))
      .filter(({ job }) => {
        const matchesCategory =
          selectedCategory === 'ALL' || job.category === selectedCategory;
        if (!matchesCategory) return false;
        if (!q) return true;
        return (
          job.title.toLowerCase().includes(q) ||
          job.company_name.toLowerCase().includes(q) ||
          job.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });

    return mapped.sort((a, b) => {
      if (sortBy === 'match_desc') return b.match.score - a.match.score;
      if (sortBy === 'match_asc') return a.match.score - b.match.score;
      return a.job.title.localeCompare(b.job.title);
    });
  }, [jobs, kaptenSkills, applications, debouncedKeyword, selectedCategory, sortBy]);

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
      <div className="min-w-0">
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-white/20 text-sm font-semibold xl:hidden"
          aria-expanded={showPreferences}
          aria-controls="explorer-preferences"
          onClick={() => setShowPreferences((open) => !open)}
        >
          Profil skill &amp; sumber lowongan
          <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${showPreferences ? 'rotate-180' : ''}`} />
        </button>
        <div id="explorer-preferences" className={showPreferences ? 'block' : 'hidden xl:block'}>
          <SkillProfileSidebar
            skills={kaptenSkills}
            onAddSkill={onAddSkill}
            onRemoveSkill={onRemoveSkill}
            jobSource={jobSource}
            onChangeJobSource={setJobSource}
          />
        </div>
      </div>

      <section className="min-w-0 space-y-5">
        {/* Search, Category Filter & Sort Toolbar */}
        <div className="@container">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 @min-[44rem]:grid-cols-[minmax(0,1fr)_11rem_10rem]">
            <label className="search-field col-span-2 @min-[44rem]:col-span-1">
              <Search aria-hidden="true" className="size-4 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari posisi, perusahaan, atau skill"
                aria-label="Cari lowongan"
                aria-keyshortcuts="/"
              />
              <kbd aria-hidden="true" className="hidden text-sm [@media(hover:hover)]:inline">/</kbd>
            </label>

            <select
              aria-label="Filter kategori lowongan"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="field min-w-0"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              aria-label="Urutkan lowongan"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as JobSortOption)}
              className="field min-w-0"
            >
              <option value="match_desc">Match Tertinggi</option>
              <option value="match_asc">Match Terendah</option>
              <option value="title_asc">Judul A–Z</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-white/75">
            {!isLoading && !error && <span role="status">
              Menampilkan{' '}
              <strong className="text-[#9afff6] tabular-nums">
                {enrichedAndFilteredJobs.length}
              </strong>{' '}
              dari <strong className="tabular-nums">{jobs.length}</strong> lowongan (
              {jobSource === 'live' ? 'Remotive Live API' : 'Dataset Lokal Indonesia'})
            </span>}
            {searchKeyword !== debouncedKeyword && (
              <span className="inline-flex items-center gap-1.5 text-[#00f6ff]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Mencari…
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="panel flex flex-col items-center justify-center rounded-[12px] px-6 py-16 text-center">
            <Loader2 className="h-9 w-9 animate-spin text-[#00f6ff]" />
            <p className="eyebrow mt-4 text-[#9afff6]">Memuat Lowongan</p>
            <p className="mt-1.5 text-sm text-white/75">
              Mengambil data terbaru dari{' '}
              {jobSource === 'live' ? 'Remotive API' : 'Dataset Magang ID'}...
            </p>
          </div>
        )}

        {/* Error State + Retry + Fallback Lokal */}
        {!isLoading && error && (
          <div
            role="alert"
            className="panel rounded-[12px] border-[#ffc1c1]/60 p-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffc1c1]/15 text-[#ffc1c1]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="eyebrow mt-4 text-[#ffc1c1]">Gagal Mengambil Data</p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Koneksi ke sumber lowongan terputus
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75">{error}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRetryToken((prev) => prev + 1)}
                className="button button-primary"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
              {jobSource === 'live' && (
                <button
                  type="button"
                  onClick={() => setJobSource('local')}
                  className="button button-accent"
                >
                  <Database className="h-4 w-4" />
                  Gunakan Fallback Lokal
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && enrichedAndFilteredJobs.length === 0 && (
          <div className="panel rounded-[12px] p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#9afff6]" />
            <h3 className="mt-3 text-lg font-bold text-white">
              Tidak ada lowongan yang cocok
            </h3>
            <p className="mt-1 text-sm text-white/75">
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
            {(searchKeyword || selectedCategory !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedCategory('ALL');
                }}
                className="button button-secondary mt-5"
              >
                Reset Pencarian &amp; Filter
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && enrichedAndFilteredJobs.length > 0 && (
          <ul aria-label="Hasil pencarian lowongan" className="border-t border-white/15">
            {enrichedAndFilteredJobs.map(({ job, match, alreadyApplied }) => (
              <li key={job.id} className="job-row">
                <article aria-labelledby={`job-title-${job.id}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <p className="text-white/65">{job.category}</p>
                    <span className={`rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums ${matchBadgeColors(match.score)}`}>
                      {match.score}% cocok
                    </span>
                  </div>
                  <h3 id={`job-title-${job.id}`} className="mt-1 text-xl font-semibold leading-snug tracking-tight">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-base">{job.company_name}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/75">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4 shrink-0" />
                      {job.candidate_required_location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Wallet aria-hidden="true" className="size-4 shrink-0" />
                      {job.salary}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-1">
                    <div className="min-w-0 space-y-1 text-sm text-white/75">
                      {match.matchedSkills.length > 0 && (
                        <p><strong className="font-medium text-(--accent)">Skill cocok</strong> · {match.matchedSkills.join(', ')}</p>
                      )}
                      {match.missingSkills.length > 0 && (
                        <p><strong className="font-medium text-white/90">Belum di profil</strong> · {match.missingSkills.join(', ')}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={alreadyApplied}
                      onClick={() => onSaveToWishlist(job)}
                      className="job-save"
                    >
                      {alreadyApplied ? <BookmarkCheck aria-hidden="true" size={16} /> : <BookmarkPlus aria-hidden="true" size={16} />}
                      {alreadyApplied ? 'Sudah Dilamar' : 'Simpan ke Wishlist'}
                      <span className="sr-only"> — {job.title}, {job.company_name}</span>
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
