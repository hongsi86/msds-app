// 화면 표시 설정(주간/야간/고대비, 글자 크기). <html data-theme data-scale> 로 적용하고 기기에 기억한다.
export type Theme = 'day' | 'night' | 'contrast';
export type Scale = '0' | '1' | '2';

export const THEMES: { key: Theme; label: string }[] = [
  { key: 'day', label: '주간' },
  { key: 'night', label: '야간' },
  { key: 'contrast', label: '고대비' },
];

export const THEME_COLOR: Record<Theme, string> = {
  day: '#ffffff',
  night: '#1c1714',
  contrast: '#ffffff',
};

const THEME_KEY = 'cg_theme';
const SCALE_KEY = 'cg_scale';

/** 첫 그림 전에 실행하는 인라인 스크립트(깜빡임 방지). 저장값이 없으면 기기 다크모드를 따라 야간으로 */
export const DISPLAY_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('${THEME_KEY}');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'night':'day';d.dataset.theme=t;d.dataset.scale=localStorage.getItem('${SCALE_KEY}')||'0';var m=document.querySelector('meta[name=theme-color]');if(m)m.content=${JSON.stringify(THEME_COLOR)}[t]||'#ffffff'}catch(e){}})();`;

function apply(theme: Theme, scale: Scale) {
  const d = document.documentElement;
  d.dataset.theme = theme;
  d.dataset.scale = scale;
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(SCALE_KEY, scale);
  } catch {
    /* 저장 못 해도 이번 화면에는 적용됨 */
  }
}

export function readDisplay(): { theme: Theme; scale: Scale } {
  const d = document.documentElement.dataset;
  return { theme: (d.theme as Theme) || 'day', scale: (d.scale as Scale) || '0' };
}

export function setTheme(theme: Theme) {
  apply(theme, readDisplay().scale);
}

export function setScale(scale: Scale) {
  apply(readDisplay().theme, scale);
}

const listeners = new Set<() => void>();
export function subscribeDisplay(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function notifyDisplay() {
  listeners.forEach((l) => l());
}
