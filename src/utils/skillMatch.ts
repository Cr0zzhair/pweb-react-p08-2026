import type { Application, SkillMatchResult, WorkMode } from '../types';

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function calculateSkillMatch(
  kaptenSkills: string[],
  requiredSkills: string[]
): SkillMatchResult {
  const cleanRequired = requiredSkills
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (cleanRequired.length === 0) {
    return {
      score: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const ownedSet = new Set(kaptenSkills.map(normalizeText));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of cleanRequired) {
    if (ownedSet.has(normalizeText(req))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const score = Math.round((matchedSkills.length / cleanRequired.length) * 100);
  return { score, matchedSkills, missingSkills };
}

export function isDuplicateApplication(
  applications: Application[],
  company: string,
  role: string
): boolean {
  const targetCompany = normalizeText(company);
  const targetRole = normalizeText(role);

  return applications.some(
    (app) =>
      normalizeText(app.company) === targetCompany &&
      normalizeText(app.role) === targetRole
  );
}

export function inferWorkModeFromLocation(location: string): WorkMode {
  const lower = location.toLowerCase();
  if (lower.includes('hybrid')) return 'Hybrid';
  if (lower.includes('onsite') || lower.includes('on-site')) return 'Onsite';
  return 'Remote';
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'AM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
