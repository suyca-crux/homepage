import React, { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import type { FormatRow, FormatGroup } from './convert';
import { GROUP_LABEL } from './convert';
import type { RampStep } from './ramp';

/**
 * クリップボードにコピーし、成功したら一定時間チェックマークを出すボタン
 */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
      () => setCopied(false)
    );
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}をコピー`}
      className="shrink-0 rounded-button p-1.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary dark:hover:text-primary-400 transition-colors"
    >
      {copied ? (
        <Check size={16} className="text-success" aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * 変換結果を色空間のグループごとに並べる
 */
export function FormatTable({ rows }: { rows: FormatRow[] }) {
  const groups: FormatGroup[] = ['srgb', 'perceptual', 'wide'];

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group}>
          <h3 className="text-caption font-bold text-neutral-500 dark:text-neutral-400 tracking-widest mb-2">
            {GROUP_LABEL[group]}
          </h3>
          <dl className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800 rounded-card border border-neutral-200 dark:border-neutral-800">
            {rows
              .filter((r) => r.group === group)
              .map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 px-4 py-2.5 min-w-0 has-[:hover]:bg-neutral-50 dark:has-[:hover]:bg-neutral-900 transition-colors"
                >
                  <dt className="text-caption text-neutral-500 dark:text-neutral-400 w-40 shrink-0">
                    {row.label}
                  </dt>
                  <dd className="flex-1 min-w-0 font-mono text-caption text-neutral-900 dark:text-neutral-50 truncate">
                    {row.value}
                  </dd>
                  <CopyButton text={row.value} label={row.label} />
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/**
 * 11段のカラーランプ。各段をクリックすると hex がコピーされる
 */
export function RampStrip({ title, steps }: { title: string; steps: RampStep[] }) {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (step: RampStep) => {
    navigator.clipboard.writeText(step.hex).then(
      () => {
        setCopied(step.step);
        setTimeout(() => setCopied(null), 1200);
      },
      () => setCopied(null)
    );
  };

  return (
    <div>
      <h3 className="text-caption font-bold text-neutral-500 dark:text-neutral-400 tracking-widest mb-2">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-11 gap-1 min-w-[560px]">
          {steps.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => copy(s)}
              title={
                `${s.hex} — oklch(${s.l}% ${s.c.toFixed(4)} ${s.h.toFixed(1)})` +
                (s.clipped
                  ? `\nsRGB に収めるため彩度を ${s.requestedC.toFixed(4)} → ${s.c.toFixed(4)} に圧縮 (-${Math.round((1 - s.c / s.requestedC) * 100)}%)`
                  : '')
              }
              className="group flex flex-col items-center gap-1"
            >
              <span
                className="relative w-full h-14 rounded-input border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: s.hex, color: s.l < 60 ? '#ffffff' : '#000000' }}
              >
                {copied === s.step && <Check size={14} aria-hidden="true" />}
                {s.clipped && copied !== s.step && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 h-1.5 w-1.5 rounded-badge bg-current opacity-40"
                  />
                )}
              </span>
              <span className="text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">
                {s.step}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 truncate w-full">
                {s.hex}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 生成結果のコードブロック
 */
export function CodeOutput({ code, label }: { code: string; label: string }) {
  return (
    <div className="relative rounded-card border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} label={label} />
      </div>
      <pre className="overflow-x-auto p-4 pr-12 text-caption font-mono leading-relaxed text-neutral-900 dark:text-neutral-50">
        {code}
      </pre>
    </div>
  );
}

/**
 * セクション見出し
 */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-h3 font-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {children}
    </section>
  );
}
