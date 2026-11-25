import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

const INITIAL_SECONDS = 120; // 02:00

const INTERVIEW_QUESTIONS: string[] = [
  'Ceritakan bug tersulit saat mengelola state di proyek React yang pernah kamu buat, dan bagaimana cara memperbaikinya?',
  'Apa perbedaan antara useState, useRef, dan derived state? Kapan kamu memilih masing-masing?',
  'Bagaimana cara kamu memastikan proses fetch data di React aman dari race condition atau memory leak saat komponen unmount?',
  'Jelaskan bagaimana kamu menjaga immutability saat meng-update nested array atau object di React state.',
  'Ceritakan pengalamanmu bekerja dalam tim menggunakan Git. Bagaimana cara kamu menangani merge conflict?',
  'Jika diberi fitur baru dengan deadline ketat, bagaimana langkahmu memecah masalah dan memprioritaskan tugas?',
];

function formatTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function InterviewPrepTimer() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleToggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(INITIAL_SECONDS);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
  };

  const handleNextQuestion = () => {
    setIsRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
    setQuestionIndex((prev) => (prev + 1) % INTERVIEW_QUESTIONS.length);
  };

  const isTimeUp = secondsLeft === 0;
  const isLowTime = secondsLeft > 0 && secondsLeft <= 20;

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] border border-white/25 bg-[#003471]/70 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-[#00f6ff]">Latihan Interview Magang IT</span>
          <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#9afff6]">
            Soal {questionIndex + 1} / {INTERVIEW_QUESTIONS.length}
          </span>
        </div>

        <blockquote className="mt-4 text-base leading-relaxed font-semibold text-white md:text-lg">
          &ldquo;{INTERVIEW_QUESTIONS[questionIndex]}&rdquo;
        </blockquote>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-[10px] border border-white/25 bg-[#003471]/90 p-5 sm:flex-row">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-white/70 uppercase">
            Countdown Timer
          </p>
          <p
            className={`mt-1 text-4xl font-extrabold tabular-nums tracking-tight ${
              isTimeUp
                ? 'text-[#ffc1c1]'
                : isLowTime
                ? 'text-[#fde68a]'
                : 'text-[#00f6ff]'
            }`}
          >
            {formatTimer(secondsLeft)}
          </p>
          {isTimeUp && (
            <p className="mt-1 text-xs font-semibold text-[#ffc1c1]">
              Waktu habis! Coba simpulkan jawabanmu dengan ringkas.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleRun}
            className="button button-primary min-h-10 px-4 py-2 text-sm"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Jeda
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {isTimeUp ? 'Mulai Ulang' : 'Start'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="button button-secondary min-h-10 px-4 py-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="button button-accent min-h-10 px-4 py-2 text-sm"
          >
            <SkipForward className="h-4 w-4" />
            Soal Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
