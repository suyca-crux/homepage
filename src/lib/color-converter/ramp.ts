import { clampChroma, formatHex, type Oklch } from 'culori';

/**
 * @vipelar/ui の既存ランプ（primary / neutral）を OKLCH 上で実測して得たプロファイル。
 *
 * - L は primary / neutral 共通の固定テーブル
 * - H は段階を通して一定（= 入力色の色相をそのまま使う）
 * - C は 500 をピークとする山形カーブ
 *
 * このプロファイルに #7a79d7 を入れると、現行の primary ランプが
 * 各チャンネル誤差 3/255 以内で再現される。
 */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type Step = (typeof STEPS)[number];

export const L_STEPS: Record<Step, number> = {
  50: 98,
  100: 96,
  200: 90,
  300: 82,
  400: 72,
  500: 62,
  600: 52,
  700: 42,
  800: 32,
  900: 22,
  950: 15,
};

export const C_RATIOS: Record<Step, number> = {
  50: 0.059,
  100: 0.154,
  200: 0.375,
  300: 0.685,
  400: 0.95,
  500: 1.0,
  600: 0.949,
  700: 0.801,
  800: 0.655,
  900: 0.46,
  950: 0.357,
};

/** ニュートラルの既定値（現行スペックの寒色グレー） */
export const NEUTRAL_HUE = 240;
export const NEUTRAL_PEAK_C = 0.0142;

/**
 * アラート4色は入力色に依存しない意味論的な色なので、現行スペックの値をそのまま使う。
 * 派生の -bg / -text も、スペックに記録されている実測値を引き継ぐ。
 */
export const ALERTS = {
  success: { base: '#46944b', bg: '#e3efe4', text: '#2b6630' },
  warning: { base: '#d09a30', bg: '#f8f0e0', text: '#8a6413' },
  danger: { base: '#c35c57', bg: '#f6e7e6', text: '#93342f' },
  info: { base: '#1289c7', bg: '#dbedf7', text: '#0d5f8b' },
} as const;

export const VIPELAR = '#d396ed';

export type RampStep = {
  step: Step;
  hex: string;
  l: number;
  /** sRGB に収めたあとの実際の彩度 */
  c: number;
  /** プロファイルが求めた彩度 */
  requestedC: number;
  h: number;
  /** sRGB に収めるため彩度を落とした段かどうか */
  clipped: boolean;
};

/**
 * 色相と最大彩度から 50〜950 の11段を生成する
 * sRGB からはみ出す段は彩度を落として収める
 */
export function generateRamp(hue: number, peakChroma: number): RampStep[] {
  return STEPS.map((step) => {
    const l = L_STEPS[step];
    const requested = peakChroma * C_RATIOS[step];
    const wanted: Oklch = { mode: 'oklch', l: l / 100, c: requested, h: hue };
    const fitted = clampChroma(wanted, 'oklch', 'rgb');
    const actual = fitted.c ?? 0;
    return {
      step,
      hex: formatHex(fitted),
      l,
      c: actual,
      requestedC: requested,
      h: hue,
      clipped: requested - actual > 0.0005,
    };
  });
}

export type PaletteOptions = {
  /** ニュートラルを primary と同じ色相で色づけるか */
  tintNeutral: boolean;
};

export type Palette = {
  primary: RampStep[];
  neutral: RampStep[];
  /** primary-500 の hex（= bare な primary エイリアス） */
  primaryBase: string;
};

export function buildPalette(hue: number, peakChroma: number, opts: PaletteOptions): Palette {
  const primary = generateRamp(hue, peakChroma);
  const neutral = generateRamp(opts.tintNeutral ? hue : NEUTRAL_HUE, NEUTRAL_PEAK_C);
  return {
    primary,
    neutral,
    primaryBase: primary.find((s) => s.step === 500)!.hex,
  };
}

/** DESIGN.md の frontmatter に貼る colors ブロック */
export function toDesignMd(palette: Palette): string {
  const lines: string[] = ['colors:'];
  lines.push(`  primary: '${palette.primaryBase}'`);
  for (const s of palette.primary) lines.push(`  primary-${s.step}: '${s.hex}'`);
  for (const s of palette.neutral) lines.push(`  neutral-${s.step}: '${s.hex}'`);
  for (const [name, v] of Object.entries(ALERTS)) lines.push(`  ${name}: '${v.base}'`);
  return lines.join('\n');
}

/** @vipelar/ui の theme.css に貼る @theme ブロック（色の部分のみ） */
export function toThemeCss(palette: Palette): string {
  const lines: string[] = [
    '@custom-variant dark (&:where(.dark, .dark *));',
    '',
    '@theme {',
    `  --color-primary: ${palette.primaryBase};`,
  ];
  for (const s of palette.primary) lines.push(`  --color-primary-${s.step}: ${s.hex};`);
  lines.push('');
  for (const s of palette.neutral) lines.push(`  --color-neutral-${s.step}: ${s.hex};`);
  lines.push('');
  for (const [name, v] of Object.entries(ALERTS)) lines.push(`  --color-${name}: ${v.base};`);
  lines.push('');
  for (const [name, v] of Object.entries(ALERTS)) lines.push(`  --color-${name}-bg: ${v.bg};`);
  lines.push('');
  for (const [name, v] of Object.entries(ALERTS)) lines.push(`  --color-${name}-text: ${v.text};`);
  lines.push('');
  lines.push(`  --color-vipelar: ${VIPELAR};`);
  lines.push('}');
  return lines.join('\n');
}
