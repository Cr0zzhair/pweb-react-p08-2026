import { useMemo, useState } from 'react';
import { Award, Scale, Wallet } from 'lucide-react';
import type { Application } from '../types';
import { calculateSkillMatch } from '../utils/skillMatch';
import { formatRupiah } from '../utils/scheduleConflict';

interface OfferComparatorProps {
  applications: Application[];
  kaptenSkills: string[];
}

const WORK_MODE_SCORE: Record<Application['workMode'], number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

const formatPoints = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function calculateWeightedScore(application: Application, maxSalary: number, skills: string[]) {
  const salaryPoints =
    maxSalary > 0 ? ((application.salaryOffer ?? 0) / maxSalary) * 50 : 0;
  const skillScore = calculateSkillMatch(skills, application.requiredSkills).score;
  const workModeScore = WORK_MODE_SCORE[application.workMode];
  const workModePoints = workModeScore * 0.25;
  const skillPoints = skillScore * 0.25;

  return {
    salaryPoints,
    skillScore,
    workModeScore,
    workModePoints,
    skillPoints,
    total: salaryPoints + workModePoints + skillPoints,
  };
}

export function OfferComparator({
  applications,
  kaptenSkills,
}: OfferComparatorProps) {
  const offers = useMemo(
    () => applications.filter((application) => application.status === 'OFFER'),
    [applications]
  );
  const [offerAId, setOfferAId] = useState('');
  const [offerBId, setOfferBId] = useState('');

  const selectedA =
    offers.find((offer) => offer.id === offerAId) ?? offers[0] ?? null;
  const selectedB =
    offers.find((offer) => offer.id === offerBId && offer.id !== selectedA?.id) ??
    offers.find((offer) => offer.id !== selectedA?.id) ??
    null;
  const maxSalary = Math.max(0, ...offers.map((offer) => offer.salaryOffer ?? 0));
  const scoreA = selectedA
    ? calculateWeightedScore(selectedA, maxSalary, kaptenSkills)
    : null;
  const scoreB = selectedB
    ? calculateWeightedScore(selectedB, maxSalary, kaptenSkills)
    : null;
  const isTie = scoreA !== null && scoreB !== null && scoreA.total === scoreB.total;

  if (offers.length < 2) {
    return (
      <section className="panel p-8 text-center sm:p-12">
        <Scale className="mx-auto h-10 w-10 text-[#42F5D1]" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold">Belum cukup offer untuk dibandingkan</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-[#C2B9D4]">
          Tambahkan minimal 2 lamaran berstatus OFFER untuk membandingkan gaji, mode kerja,
          Skill Match, dan skor berbobot.
        </p>
        <p className="mt-4 text-sm font-semibold tabular-nums text-[#42F5D1]">
          Offer saat ini: {offers.length} / 2 minimum
        </p>
      </section>
    );
  }

  const renderOffer = (
    offer: Application,
    score: NonNullable<typeof scoreA>,
    side: 'A' | 'B'
  ) => {
    const recommended =
      isTie || (side === 'A' ? scoreA!.total > scoreB!.total : scoreB!.total > scoreA!.total);

    return (
      <article className="panel flex min-w-0 flex-col gap-4 p-5">
        <div>
          <label htmlFor={`offer-${side}`} className="mb-2 block text-sm font-semibold">
            Pilih Offer {side}
          </label>
          <select
            id={`offer-${side}`}
            value={offer.id}
            onChange={(event) =>
              side === 'A' ? setOfferAId(event.target.value) : setOfferBId(event.target.value)
            }
            className="field"
          >
            {offers.map((option) => (
              <option
                key={option.id}
                value={option.id}
                disabled={side === 'A' ? option.id === selectedB?.id : option.id === selectedA?.id}
              >
                {option.company} — {option.role}
              </option>
            ))}
          </select>
        </div>

        <div className="border-b border-[#8878AB] pb-3">
          <h3 className="text-lg font-bold">{offer.company}</h3>
          <p className="text-sm text-[#C2B9D4]">{offer.role}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="border border-[#8878AB] bg-[#30264A] p-3">
            <dt className="text-[#C2B9D4]">Gaji / bulan</dt>
            <dd className="mt-1 flex items-center gap-1 font-bold tabular-nums">
              <Wallet className="h-4 w-4 text-[#42F5D1]" aria-hidden="true" />
              {offer.salaryOffer ? formatRupiah(offer.salaryOffer) : 'Tidak dicantumkan'}
            </dd>
            <dd className="mt-1 text-xs text-[#C2B9D4]">{formatPoints.format(score.salaryPoints)} / 50 poin</dd>
          </div>
          <div className="border border-[#8878AB] bg-[#30264A] p-3">
            <dt className="text-[#C2B9D4]">Mode kerja</dt>
            <dd className="mt-1 font-bold">{offer.workMode} ({score.workModeScore})</dd>
            <dd className="mt-1 text-xs text-[#C2B9D4]">
              {formatPoints.format(score.workModePoints)} / 25 poin
            </dd>
          </div>
          <div className="col-span-2 border border-[#8878AB] bg-[#30264A] p-3">
            <dt className="text-[#C2B9D4]">Skill Match</dt>
            <dd className="mt-1 font-bold tabular-nums">{score.skillScore}%</dd>
            <dd className="mt-1 text-xs text-[#C2B9D4]">{formatPoints.format(score.skillPoints)} / 25 poin</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-3 border-2 border-[#42F5D1] p-3">
          <div>
            <p className="text-xs font-semibold text-[#C2B9D4]">TOTAL SKOR BERBOBOT</p>
            <p className="text-2xl font-extrabold tabular-nums text-[#42F5D1]">
              {formatPoints.format(score.total)}
            </p>
          </div>
          {recommended && (
            <span className="inline-flex items-center gap-1 border border-[#FFD166] bg-[#FFD166]/15 px-2 py-1 text-xs font-bold text-[#FFD166]">
              <Award className="h-4 w-4" aria-hidden="true" />
              Rekomendasi Terbaik{isTie ? ' (Setara)' : ''}
            </span>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow text-[#42F5D1]">Bandingkan Paket Offer</p>
        <h2 className="mt-2 text-xl font-bold">Pilih yang paling sesuai, Kapten.</h2>
        <p className="mt-1 text-sm text-[#C2B9D4]">
          Gaji menyumbang 50% dari skor, mode kerja 25%, dan Skill Match 25%.
          Gaji tertinggi dari seluruh offer mendapat 50 poin.
          Skor mode kerja adalah 100 untuk Remote, 75 untuk Hybrid, dan 50 untuk Onsite.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {selectedA && scoreA && renderOffer(selectedA, scoreA, 'A')}
        {selectedB && scoreB && renderOffer(selectedB, scoreB, 'B')}
      </div>
    </section>
  );
}
