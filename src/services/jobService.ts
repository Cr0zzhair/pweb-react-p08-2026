import type { JobListing, JobSource } from '../types';

const REMOTIVE_API_URL =
  'https://remotive.com/api/remote-jobs?category=software-dev&limit=30';
const LOCAL_FALLBACK_URL = '/magang-fallback.json';

interface RemotiveApiResponse {
  jobs: Array<{
    id: number;
    title: string;
    company_name: string;
    category: string;
    candidate_required_location: string;
    salary: string;
    tags?: string[];
    url?: string;
  }>;
}

export async function fetchJobs(
  source: JobSource,
  signal: AbortSignal
): Promise<JobListing[]> {
  const endpoint = source === 'live' ? REMOTIVE_API_URL : LOCAL_FALLBACK_URL;

  const response = await fetch(endpoint, { signal });
  if (!response.ok) {
    throw new Error(
      `Gagal memuat data dari ${source === 'live' ? 'Remotive API' : 'Dataset Lokal'} (HTTP ${response.status})`
    );
  }

  const data = (await response.json()) as RemotiveApiResponse;
  if (!Array.isArray(data.jobs)) {
    throw new Error('Format data lowongan tidak valid.');
  }

  return data.jobs.map((item) => ({
    id: item.id,
    title: item.title,
    company_name: item.company_name,
    category: item.category || 'Software Development',
    candidate_required_location: item.candidate_required_location || 'Remote',
    salary: item.salary && item.salary.trim().length > 0 ? item.salary : 'Negotiable / Stipend',
    tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.slice(0, 6) : ['Software Development'],
    url: item.url,
  }));
}
