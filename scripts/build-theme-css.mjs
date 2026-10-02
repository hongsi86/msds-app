// 야간·고대비 테마 CSS 생성기.
// 앱 전체가 Tailwind 기본 팔레트(slate-500, rose-50 …)를 직접 쓰므로, 화면 코드를 고치지 않고
// 팔레트 변수만 테마별로 다시 정의한다. 규칙: 50~300 은 배경·테두리, 700~900 은 글자로 쓰인다.
// 실행: node scripts/build-theme-css.mjs  → src/app/themes.css
import { readFileSync, writeFileSync } from 'node:fs';

const theme = readFileSync('node_modules/tailwindcss/theme.css', 'utf8');
const FAMILIES = ['slate', 'rose', 'blue', 'amber', 'red', 'violet', 'emerald', 'teal', 'sky', 'orange', 'yellow'];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const pal = {};
for (const f of FAMILIES) {
  pal[f] = {};
  for (const s of SHADES) {
    const m = theme.match(new RegExp(`--color-${f}-${s}: oklch\\(([\\d.]+)% ([\\d.]+) ([\\d.]+)\\)`));
    if (!m) throw new Error(`${f}-${s}`);
    pal[f][s] = { l: Number(m[1]) / 100, c: Number(m[2]), h: Number(m[3]) };
  }
}
const ok = ({ l, c, h }) => `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;

// 주간: 흰 배경에서 읽기 어려운 연한 회색 글자를 한 단계씩 진하게(대비 4.5:1 이상)
const day = [
  `--color-slate-300: ${ok(pal.slate[500])};`,
  `--color-slate-400: ${ok({ ...pal.slate[600], l: 0.5 })};`,
  `--color-slate-500: ${ok({ ...pal.slate[600], l: 0.47 })};`,
];

// 야간: 밝기를 뒤집되 최고 밝기를 낮추고(야간 시력 보호) 무채색은 따뜻한 쪽으로
const NIGHT_NEUTRAL_L = { 50: 0.145, 100: 0.225, 200: 0.3, 300: 0.38, 400: 0.66, 500: 0.72, 600: 0.77, 700: 0.82, 800: 0.86, 900: 0.88, 950: 0.9 };
const NIGHT_ACCENT_L = { 50: 0.2, 100: 0.24, 200: 0.32, 300: 0.4, 400: 0.6, 500: 0.55, 600: 0.56, 700: 0.78, 800: 0.82, 900: 0.85, 950: 0.88 };
const night = [];
for (const f of FAMILIES) {
  for (const s of SHADES) {
    const p = pal[f][s];
    if (f === 'slate') {
      night.push(`--color-slate-${s}: ${ok({ l: NIGHT_NEUTRAL_L[s], c: 0.012, h: 45 })};`);
    } else {
      const c = s <= 300 ? Math.min(p.c * 0.5, 0.05) : s >= 700 ? Math.min(p.c, 0.12) : p.c * 0.85;
      night.push(`--color-${f}-${s}: ${ok({ l: NIGHT_ACCENT_L[s], c, h: p.h })};`);
    }
  }
}

// 고대비(연기·직사광선): 흰 바탕·검은 글자·진한 테두리, 중간 톤 없음
const contrast = [];
for (const f of FAMILIES) {
  for (const s of SHADES) {
    if (f === 'slate') {
      contrast.push(`--color-slate-${s}: ${s <= 100 ? '#fff' : '#000'};`);
    } else {
      const src = s <= 100 ? null : s <= 300 ? 800 : s === 400 ? 400 : s <= 600 ? 700 : 900;
      contrast.push(`--color-${f}-${s}: ${src ? ok(pal[f][src]) : '#fff'};`);
    }
  }
}

const css = `/* 생성 파일 — scripts/build-theme-css.mjs 로 다시 만든다. 직접 고치지 말 것. */
:root {
  ${day.join('\n  ')}
}

:root[data-theme='night'] {
  color-scheme: dark;
  --background: ${ok({ l: 0.145, c: 0.012, h: 45 })};
  --foreground: ${ok({ l: 0.86, c: 0.012, h: 45 })};
  --surface: ${ok({ l: 0.195, c: 0.012, h: 45 })};
  ${night.join('\n  ')}
}

:root[data-theme='contrast'] {
  --background: #fff;
  --foreground: #000;
  --surface: #fff;
  ${contrast.join('\n  ')}
}
`;
writeFileSync('src/app/themes.css', css);
console.log('wrote src/app/themes.css', css.length, 'bytes');
