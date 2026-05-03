"use client";

interface Props {
  current: number;
  total: number;
  answered: number;
}

export function ProgressBar({ current, total, answered }: Props) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        <span>السؤال {current} من {total}</span>
        <span>{pct}% مكتمل</span>
      </div>
      <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-gradient rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
