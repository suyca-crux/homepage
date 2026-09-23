import {
  converter,
  parse,
  formatHex,
  formatHex8,
  displayable,
  inGamut,
  clampChroma,
  type Color,
} from 'culori';

const inP3 = inGamut('p3');

const toRgb = converter('rgb');
const toHsl = converter('hsl');
const toHwb = converter('hwb');
const toLab = converter('lab');
const toLch = converter('lch');
const toOklab = converter('oklab');
const toOklch = converter('oklch');
const toP3 = converter('p3');

/**
 * 小数を指定桁で丸める
 * culori は無彩色の色相を undefined で返すため、その場合は 0 として扱う
 */
function round(value: number | undefined, digits: number): number {
  if (value === undefined || Number.isNaN(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** アルファが 1 未満のときだけ ` / 0.5` の形で付ける */
function alphaSuffix(color: Color): string {
  const alpha = color.alpha ?? 1;
  return alpha >= 1 ? '' : ` / ${round(alpha, 3)}`;
}

export type FormatGroup = 'srgb' | 'perceptual' | 'wide';

export type FormatRow = {
  id: string;
  label: string;
  value: string;
  group: FormatGroup;
};

export const GROUP_LABEL: Record<FormatGroup, string> = {
  srgb: 'sRGB を別の軸で書いたもの',
  perceptual: '知覚的に均等な色空間',
  wide: '色空間を明示する記法',
};

/**
 * 任意の CSS 色文字列をパースする
 * 受け付けられなければ undefined
 */
export function parseColor(input: string): Color | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  return parse(trimmed);
}

/**
 * 1色をすべての対応形式に変換する
 * HEX 系は sRGB ガマットに収まらないと表現できないため、
 * はみ出す入力では彩度を落とした近似値を返す（isClipped で通知する）
 */
export function toAllFormats(color: Color): FormatRow[] {
  const inGamut = displayable(color);
  const forHex = inGamut ? color : (clampChroma(color, 'oklch', 'rgb') ?? color);

  // HEX / rgb / hsl / hwb はいずれも sRGB 座標上の記法なので、
  // ガマット外の色をそのまま変換すると彩度 290% のような無意味な値になる。
  // 必ずガマットマッピング後の色から計算する。
  const rgb = toRgb(forHex);
  const hsl = toHsl(forHex);
  const hwb = toHwb(forHex);
  const lab = toLab(color);
  const lch = toLch(color);
  const oklab = toOklab(color);
  const oklch = toOklch(color);
  const p3 = toP3(color);

  const a = alphaSuffix(color);
  const ch = (v: number | undefined) => round(v, 4);

  return [
    { id: 'hex', label: 'HEX', value: formatHex(forHex), group: 'srgb' },
    { id: 'hex8', label: 'HEX + alpha', value: formatHex8(forHex), group: 'srgb' },
    {
      id: 'rgb',
      label: 'rgb()',
      value: `rgb(${Math.round(rgb.r * 255)} ${Math.round(rgb.g * 255)} ${Math.round(rgb.b * 255)}${a})`,
      group: 'srgb',
    },
    {
      id: 'hsl',
      label: 'hsl()',
      value: `hsl(${round(hsl.h, 1)} ${round(hsl.s * 100, 1)}% ${round(hsl.l * 100, 1)}%${a})`,
      group: 'srgb',
    },
    {
      id: 'hwb',
      label: 'hwb()',
      value: `hwb(${round(hwb.h, 1)} ${round(hwb.w * 100, 1)}% ${round(hwb.b * 100, 1)}%${a})`,
      group: 'srgb',
    },
    {
      id: 'lab',
      label: 'lab()',
      value: `lab(${round(lab.l, 2)}% ${round(lab.a, 2)} ${round(lab.b, 2)}${a})`,
      group: 'perceptual',
    },
    {
      id: 'lch',
      label: 'lch()',
      value: `lch(${round(lch.l, 2)}% ${round(lch.c, 2)} ${round(lch.h, 1)}${a})`,
      group: 'perceptual',
    },
    {
      id: 'oklab',
      label: 'oklab()',
      value: `oklab(${round(oklab.l * 100, 2)}% ${round(oklab.a, 4)} ${round(oklab.b, 4)}${a})`,
      group: 'perceptual',
    },
    {
      id: 'oklch',
      label: 'oklch()',
      value: `oklch(${round(oklch.l * 100, 2)}% ${round(oklch.c, 4)} ${round(oklch.h, 1)}${a})`,
      group: 'perceptual',
    },
    {
      id: 'p3',
      label: 'color(display-p3)',
      value: `color(display-p3 ${ch(p3.r)} ${ch(p3.g)} ${ch(p3.b)}${a})`,
      group: 'wide',
    },
  ];
}

/** どの色域まで収まるかを調べる（sRGB に収まらなければ HEX では正確に表せない） */
export function gamutInfo(color: Color): { srgb: boolean; p3: boolean } {
  return { srgb: displayable(color), p3: inP3(color) };
}

/** プレビュー用に、必ず画面に出せる HEX を得る */
export function toDisplayHex(color: Color): string {
  return formatHex(displayable(color) ? color : (clampChroma(color, 'oklch', 'rgb') ?? color));
}

/** OKLCH の L(0-100) / C / H を取り出す */
export function toOklchParts(color: Color): { l: number; c: number; h: number } {
  const o = toOklch(color);
  return { l: (o.l ?? 0) * 100, c: o.c ?? 0, h: o.h ?? 0 };
}
