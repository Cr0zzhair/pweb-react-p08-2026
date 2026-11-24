import type { Application } from '../types';

export const DEFAULT_KAPTEN_SKILLS: string[] = [
  'React',
  'TypeScript',
  'CSS',
  'Git',
  'REST API',
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'seed-app-1',
    company: 'Garuda FinTech',
    role: 'Full-Stack Web Developer Intern',
    workMode: 'Remote',
    status: 'INTERVIEW',
    requiredSkills: ['React', 'TypeScript', 'PostgreSQL', 'Express', 'Prisma'],
    cvVersion: 'Kapten-CV-v2.pdf',
    appliedDate: '2026-11-10',
    interviewDateTime: '2026-11-28T10:00',
    lastUpdatedAt: '2026-11-20T09:00:00.000Z',
    checklist: [
      { id: 'c-1', text: 'Sesuaikan CV dengan proyek React + TypeScript', done: true },
      { id: 'c-2', text: 'Riset produk & tech stack Garuda FinTech', done: true },
      { id: 'c-3', text: 'Latihan soal teknis React Hooks & REST API', done: true },
      { id: 'c-4', text: 'Siapkan pertanyaan balik untuk pewawancara', done: false },
    ],
    activityLogs: [
      {
        id: 'l-1',
        timestamp: '2026-11-20T09:00:00.000Z',
        message: 'Pindah ke Interview (Jadwal 28 Nov 2026, 10:00)',
      },
      {
        id: 'l-2',
        timestamp: '2026-11-14T14:20:00.000Z',
        message: 'Lolos tahap Screening HRD',
      },
      {
        id: 'l-3',
        timestamp: '2026-11-10T08:05:00.000Z',
        message: 'Lamaran dikirim (CV: Kapten-CV-v2.pdf)',
      },
    ],
  },
  {
    id: 'seed-app-2',
    company: 'Bintang Commerce',
    role: 'Software Engineer Intern — Web Platform',
    workMode: 'Remote',
    status: 'INTERVIEW',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git', 'Testing'],
    cvVersion: 'Kapten-CV-v2.pdf',
    appliedDate: '2026-11-12',
    interviewDateTime: '2026-11-28T10:30',
    lastUpdatedAt: '2026-11-21T11:30:00.000Z',
    checklist: [
      { id: 'c-5', text: 'Review portfolio web app & GitHub repo', done: true },
      { id: 'c-6', text: 'Siapkan koneksi & kamera untuk interview online', done: false },
    ],
    activityLogs: [
      {
        id: 'l-4',
        timestamp: '2026-11-21T11:30:00.000Z',
        message: 'Pindah ke Interview (Jadwal 28 Nov 2026, 10:30)',
      },
    ],
  },
  {
    id: 'seed-app-3',
    company: 'SinarPay Indonesia',
    role: 'Backend Engineer Intern (Node.js)',
    workMode: 'Onsite',
    status: 'APPLIED',
    requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'REST API', 'Docker'],
    cvVersion: 'Kapten-CV-Backend-v1.pdf',
    appliedDate: '2026-11-18',
    lastUpdatedAt: '2026-11-18T10:00:00.000Z',
    checklist: [
      { id: 'c-7', text: 'Follow up HRD via email jika belum ada kabar', done: false },
    ],
    activityLogs: [
      {
        id: 'l-5',
        timestamp: '2026-11-18T10:00:00.000Z',
        message: 'Lamaran dikirim (CV: Kapten-CV-Backend-v1.pdf)',
      },
    ],
  },
  {
    id: 'seed-app-4',
    company: 'Karya Digital Studio',
    role: 'UI Engineer Intern',
    workMode: 'Hybrid',
    status: 'SCREENING',
    requiredSkills: ['React', 'CSS', 'Tailwind CSS', 'Figma', 'TypeScript'],
    cvVersion: 'Kapten-CV-Frontend-v3.pdf',
    appliedDate: '2026-11-02',
    lastUpdatedAt: '2026-11-05T08:00:00.000Z',
    checklist: [
      { id: 'c-8', text: 'Kirim link live demo design system', done: true },
      { id: 'c-9', text: 'Tunggu jadwal user interview', done: false },
    ],
    activityLogs: [
      {
        id: 'l-6',
        timestamp: '2026-11-05T08:00:00.000Z',
        message: 'Masuk tahap Screening HRD',
      },
    ],
  },
];
