import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookmarkPlus,
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
  getInitials,
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

function getMatchBadgeClasses(score: number): string {
  if (score >= 70) {
    return 'border-[#34d399]/60 bg-[#064e3b]/80 text-[#6ee7b7]';
  }
  if (score >= 40) {
    return 'border-[#fbbf24]/60 bg-[#78350f]/80 text-[#fde68a]';
  }
  return 'border-[#ffc1c1]/70 bg-[#7f1d1d]/80 text-[#ffc1c1]';
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
    <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-8">
      <SkillProfileSidebar
        skills={kaptenSkills}
        onAddSkill={onAddSkill}
        onRemoveSkill={onRemoveSkill}
        jobSource={jobSource}
        onChangeJobSource={setJobSource}
      />

      <section className="min-w-0 space-y-5">
        {/* Search, Category Filter & Sort Toolbar */}
        <div className="panel rounded-[12px] p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_190px]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder='Cari posisi, perusahaan, atau skill... (tekan "/")'
                aria-label="Cari lowongan"
                className="field pl-10"
              />
            </div>

            <select
              aria-label="Filter kategori lowongan"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="field"
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
              className="field"
            >
              <option value="match_desc">Match Tertinggi</option>
              <option value="match_asc">Match Terendah</option>
              <option value="title_asc">Judul A–Z</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3 text-xs text-white/75">
            <span>
              Menampilkan{' '}
              <strong className="text-[#9afff6] tabular-nums">
                {enrichedAndFilteredJobs.length}
              </strong>{' '}
              dari <strong className="tabular-nums">{jobs.length}</strong> lowongan (
              {jobSource === 'live' ? 'Remotive Live API' : 'Dataset Lokal Indonesia'})
            </span>
            {searchKeyword !== debouncedKeyword && (
              <span className="inline-flex items-center gap-1.5 text-[#00f6ff]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Menunggu debounce 400ms...
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

        {/* Job Cards Grid */}
        {!isLoading && !error && enrichedAndFilteredJobs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {enrichedAndFilteredJobs.map(({ job, match, alreadyApplied }) => (
              <article
                key={job.id}
                className="panel flex flex-col justify-between rounded-[12px] p-5 transition-colors hover:border-[#9afff6]/60 hover:bg-[#003471]/60"
              >
                <div>
                  {/* Card Top: Company + Match Score Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-white/40 bg-[#003471] text-sm font-extrabold italic text-[#00f6ff]"
                      >
                        {getInitials(job.company_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {job.company_name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/70">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9afff6]" />
                          <span className="truncate">{job.candidate_required_location}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-extrabold tabular-nums ${getMatchBadgeClasses(
                        match.score
                      )}`}
                    >
                      {match.score}% Match
                    </span>
                  </div>

                  {/* Role & Category */}
                  <h3 className="mt-4 text-base font-bold leading-snug text-white">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#9afff6]/90">
                    {job.category}
                  </p>

                  {/* Matched vs Missing Skills */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {match.matchedSkills.map((skill) => (
                      <span
                        key={`match-${skill}`}
                        className="rounded-[5px] border border-[#00f6ff]/50 bg-[#00f6ff]/15 px-2 py-0.5 text-[11px] font-semibold text-[#9afff6]"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                    {match.missingSkills.map((skill) => (
                      <span
                        key={`miss-${skill}`}
                        className="rounded-[5px] border border-[#ffc1c1]/50 bg-[#ffc1c1]/10 px-2 py-0.5 text-[11px] font-semibold text-[#ffc1c1]"
                        title="Missing skill — belum ada di Profil Kapten"
                      >
                        ✕ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Salary + Save CTA */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
                  <div className="min-w-0">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#9afff6]">
                      <Wallet className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{job.salary}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={alreadyApplied}
                    onClick={() => onSaveToWishlist(job)}
                    className={`button min-h-10 shrink-0 px-3.5 py-2 text-xs ${
                      alreadyApplied ? 'button-secondary' : 'button-primary'
                    }`}
                  >
                    {alreadyApplied ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-[#00f6ff]" />
                        Sudah Dilamar
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-4 w-4" />
                        Simpan ke Wishlist
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
