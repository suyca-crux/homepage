import React, { useMemo, useState } from 'react';
import Layout from '@/layouts/Layout';
import { Heading, Text } from '@vipelar/ui';
import {
  parseColor,
  toAllFormats,
  gamutInfo,
  toDisplayHex,
  toOklchParts,
} from '@/lib/color-converter/convert';
import { buildPalette, toDesignMd, toThemeCss } from '@/lib/color-converter/ramp';
import { FormatTable, RampStrip, CodeOutput, Section } from '@/lib/color-converter/Display';

const DEFAULT_INPUT = '#7a79d7';

const ColorConverterPage: React.FC = () => {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [tintNeutral, setTintNeutral] = useState(false);
  const [tab, setTab] = useState<'design' | 'theme'>('design');

  const parsed = useMemo(() => parseColor(input), [input]);

  const result = useMemo(() => {
    if (!parsed) return null;
    const oklch = toOklchParts(parsed);
    const palette = buildPalette(oklch.h, oklch.c, { tintNeutral });
    return {
      rows: toAllFormats(parsed),
      hex: toDisplayHex(parsed),
      gamut: gamutInfo(parsed),
      oklch,
      palette,
      designMd: toDesignMd(palette),
      themeCss: toThemeCss(palette),
    };
  }, [parsed, tintNeutral]);

  const lightnessShifted = result ? Math.abs(result.oklch.l - 62) > 3 : false;

  return (
    <Layout title="Color Converter">
      <div className="w-full max-w-3xl mx-auto">
        <Heading
          title="Color Converter"
        />

        <div className="mt-8">
          <label
            htmlFor="color-input"
            className="block text-caption font-bold text-neutral-500 dark:text-neutral-400 tracking-widest mb-2"
          >
            色を入力
          </label>
          <div className="flex items-center gap-3">
            <input
              id="color-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="#7a79d7 / oklch(62% 0.14 282) / rebeccapurple"
              className="flex-1 min-w-0 rounded-input border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 font-mono text-body text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400 transition-colors"
            />
            <input
              type="color"
              value={result?.hex ?? '#000000'}
              onChange={(e) => setInput(e.target.value)}
              aria-label="カラーピッカーで選ぶ"
              className="h-11 w-14 shrink-0 cursor-pointer rounded-input border border-neutral-200 dark:border-neutral-800 bg-transparent"
            />
          </div>

          {!parsed && input.trim() !== '' && (
            <p className="mt-2 text-caption text-danger">
              この文字列は色として解釈できませんでした。
            </p>
          )}

          {result && !result.gamut.srgb && (
            <p className="mt-2 rounded-input bg-warning-bg px-3 py-2 text-caption text-warning-text">
              この色は sRGB の外にあります。HEX・rgb()・hsl()・hwb() は彩度を落とした近似値です。
              {result.gamut.p3
                ? ' display-p3 なら表現できます。'
                : ' display-p3 の範囲も超えているため、色座標に負の値が出ます。'}
            </p>
          )}
        </div>

        {result && (
          <>
            <Section title="変換結果">
              <FormatTable rows={result.rows} />
            </Section>

            <Section title="カラーランプ">
              <Text color="gray" size="sm">
                入力色の色相と彩度を保ったまま、@vipelar/ui
                の明度テーブルに沿って11段を生成します。彩度の高い色相ほど明るい側が sRGB
                に収まらなくなるため、その段は彩度を圧縮したうえで小さな点を付けています（圧縮量はスウォッチにカーソルを合わせると出ます）。現行の
                primary ランプも同じ理由で明るい側が sRGB の端に接しています。
              </Text>

              {lightnessShifted && (
                <p className="mt-3 text-caption text-neutral-500 dark:text-neutral-400">
                  入力色の明度は L={result.oklch.l.toFixed(1)}% ですが、500 の明度は L=62%
                  に固定されているため、ランプ上では明るさが変わります。
                </p>
              )}

              <div className="mt-6 flex flex-col gap-6">
                <RampStrip title="primary" steps={result.palette.primary} />
                <RampStrip title="neutral" steps={result.palette.neutral} />
              </div>

              <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-caption text-neutral-600 dark:text-neutral-400">
                <input
                  type="checkbox"
                  checked={tintNeutral}
                  onChange={(e) => setTintNeutral(e.target.checked)}
                  className="accent-primary"
                />
                ニュートラルを入力色の色相で色づける（オフだと現行スペックの寒色グレー）
              </label>
            </Section>

            <Section title="デザイントークン出力">
              <div className="mb-4 flex gap-1">
                {(
                  [
                    ['design', 'DESIGN.md'],
                    ['theme', 'theme.css'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`rounded-button px-3 py-1.5 text-caption font-medium transition-colors ${
                      tab === id
                        ? 'bg-primary/10 text-primary dark:text-primary-400'
                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'design' ? (
                <CodeOutput code={result.designMd} label="DESIGN.md の colors ブロック" />
              ) : (
                <CodeOutput code={result.themeCss} label="theme.css の @theme ブロック" />
              )}

              <p className="mt-3 text-caption text-neutral-500 dark:text-neutral-400">
                アラート4色（success / warning / danger /
                info）は入力色に依存しない意味論的な色なので、
                現行スペックの値をそのまま出力しています。
              </p>
            </Section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ColorConverterPage;
