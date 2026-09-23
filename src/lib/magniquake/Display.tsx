import { groupByInt, formatDateTime } from './quakeUtil';
import type { Pref, Head as HeadType, Body as BodyType, Data } from './types';
import { useState, ReactNode } from 'react';

export function InfoBox({
  title,
  children,
  borderColor = 'border-neutral-200 dark:border-neutral-800',
}: {
  title: string;
  children: ReactNode;
  borderColor?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 border-l-2 ${borderColor} pl-3 py-1 transition-colors`}>
      <p className="text-caption font-bold text-primary dark:text-primary-400 uppercase tracking-wide">
        {title}
      </p>
      <div className="text-h3 font-bold text-neutral-900 dark:text-neutral-50">{children}</div>
    </div>
  );
}

export function DetailBox({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function IntList({ data }: { data: Data }) {
  const prefs: Pref[] = data.Body.Intensity?.Observation?.Pref || [];

  const grouped = groupByInt(prefs);
  const intOrder = ['7', '6+', '6-', '5+', '5-', '4', '3', '2', '1'];

  const maxInt = intOrder.find((int) => grouped[int]);
  const needShowAll = Object.keys(grouped).length > 1;

  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {intOrder
          .filter((int) => grouped[int])
          .filter((int) => showAll || int === maxInt)
          .map((int) => {
            const g = grouped[int];
            if (!g) return null;
            return <IntBlock key={int} int={int} data={g} />;
          })}
      </div>

      {!showAll && needShowAll && (
        <div className="mt-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-8 transition-colors">
          <button
            className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-3 bg-vipelar/10 text-vipelar px-8 py-3 rounded-card sm:rounded-badge hover:bg-vipelar/20 transition-colors font-bold text-body leading-tight"
            onClick={() => setShowAll(true)}
          >
            <span>すべての観測地点を表示</span>
            <span className="opacity-80 text-caption sm:text-body">
              ({Object.keys(grouped).length} 階級)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export function Head({ data }: { data: HeadType }) {
  return (
    <h1 className="text-h1 font-bold text-neutral-900 dark:text-neutral-50 transition-colors">
      {data.Title}
    </h1>
  );
}

export function Body({ data }: { data: BodyType }) {
  const earthquake = data.Earthquake;
  const depth = earthquake
    ? earthquake.Hypocenter.Depth === '0'
      ? 'ごく浅い'
      : `${earthquake.Hypocenter.Depth}km`
    : '---';

  const magnitude = earthquake
    ? earthquake.Magnitude === 'NaN'
      ? '不明'
      : `M${earthquake.Magnitude}`
    : '---';

  const hypocenterName = earthquake?.Hypocenter.Name || '---';

  const maxInt = data.Intensity?.Observation?.MaxInt || '---';

  const intStyle = getIntStyle(maxInt);
  // const intensityBorder = intStyle?.border || 'border-neutral-200 dark:border-neutral-800';
  // ↑なんなのか忘れた、どうしよう

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6">
        <InfoBox title="震源地">{hypocenterName}</InfoBox>
        <InfoBox title="最大震度">{intStyle?.label || maxInt}</InfoBox>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <InfoBox title="深さ">{depth}</InfoBox>
        <InfoBox title="マグニチュード">{magnitude}</InfoBox>
      </div>
      <InfoBox title="発生日時">
        {earthquake ? formatDateTime(earthquake.OriginTime) : '---'}
      </InfoBox>
      <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 italic transition-colors opacity-70">
        <div suppressHydrationWarning>
          <InfoBox title="画面更新">{formatDateTime(new Date().toISOString())}</InfoBox>
        </div>
      </div>
    </div>
  );
}

function IntBlock({ int, data }: { int: string; data: Record<string, string[]> }) {
  const isFilled = int === '5-' || int === '5+' || int === '6-' || int === '6+' || int === '7';
  const isExtreme = int === '7';

  const currentStyle = getIntStyle(int);

  const glowStyles: Record<string, string> = {
    '5-': 'shadow-[0_0_15px_-5px_rgba(239,68,68,0.2)]',
    '5+': 'shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)]',
    '6-': 'shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]',
    '6+': 'shadow-[0_0_40px_-5px_rgba(134,25,143,0.6)]',
    '7': 'shadow-[0_0_60px_-10px_rgba(88,28,135,0.8),0_0_20px_0_rgba(0,0,0,1)]',
  };

  return (
    <div className="relative">
      {isFilled && (
        <div
          className={`absolute inset-0 rounded-card ${glowStyles[int]} ${isExtreme ? 'animate-glow-pulse' : ''} pointer-events-none`}
        />
      )}

      <div
        className={`
        relative border-l-8 ${currentStyle.border} ${currentStyle.bg} ${currentStyle.text} p-6 rounded-r-card transition-all duration-500
        ${isFilled ? 'border-y border-r border-y-transparent border-r-transparent' : 'border-y border-r border-y-neutral-200/50 border-r-neutral-200/50 dark:border-y-neutral-800/50 dark:border-r-neutral-800/50 shadow-sm'}
        ${isExtreme ? 'ring-2 ring-purple-600/50 ring-offset-2 ring-offset-black' : ''}
      `}
      >
        <div
          className={`flex items-center justify-between mb-4 border-b pb-2 ${isFilled ? 'border-current/20' : 'border-neutral-200/20 dark:border-neutral-800/20'}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-h1 font-bold">震度 {currentStyle.label}</span>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(data).map(([pref, cities]) => (
            <div key={pref}>
              <h3
                className={`text-h4 font-bold mb-2 ${isFilled ? 'text-current opacity-90' : 'text-neutral-600 dark:text-neutral-400'}`}
              >
                {pref}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {cities.map((city) => (
                  <span
                    key={city}
                    className={`
                    text-body font-medium px-3 py-1 rounded-button border shadow-sm
                    ${
                      isFilled
                        ? 'bg-current/10 text-current border-current/20 backdrop-blur-sm'
                        : 'text-neutral-600 dark:text-neutral-400 bg-white/50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800'
                    }
                    ${isExtreme ? 'font-bold tracking-tighter' : ''}
                  `}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getIntStyle(int: string) {
  const intensityStyleMap: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    '1': {
      label: '1',
      bg: 'bg-blue-50 dark:bg-neutral-900',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-l-blue-200 dark:border-l-blue-600',
    },
    '2': {
      label: '2',
      bg: 'bg-indigo-50 dark:bg-neutral-900',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-l-indigo-200 dark:border-l-indigo-500',
    },
    '3': {
      label: '3',
      bg: 'bg-violet-50 dark:bg-neutral-900',
      text: 'text-violet-700 dark:text-violet-300',
      border: 'border-l-violet-200 dark:border-l-violet-500',
    },
    '4': {
      label: '4',
      bg: 'bg-purple-50 dark:bg-neutral-900',
      text: 'text-purple-700 dark:text-vipelar',
      border: 'border-l-purple-200 dark:border-l-vipelar/60',
    },
    '5-': { label: '5弱', bg: 'bg-amber-500', text: 'text-white', border: 'border-l-amber-500' },
    '5+': { label: '5強', bg: 'bg-orange-600', text: 'text-white', border: 'border-l-orange-600' },
    '6-': { label: '6弱', bg: 'bg-red-700', text: 'text-white', border: 'border-l-red-700' },
    '6+': {
      label: '6強',
      bg: 'bg-fuchsia-800',
      text: 'text-white',
      border: 'border-l-fuchsia-800',
    },
    '7': {
      label: '7',
      bg: 'bg-gradient-to-br from-purple-950 via-black to-purple-950',
      text: 'text-white',
      border: 'border-l-black',
    },
  };

  return intensityStyleMap[int];
}
