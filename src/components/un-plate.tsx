/** 탱크로리 뒤에 붙는 주황색 UN 표지판 모양 */
export function UnPlate({ un, size = 'sm' }: { un?: string; size?: 'sm' | 'lg' }) {
  const digits = un?.replace(/^UN/i, '') ?? '';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] border-2 border-slate-900 bg-erg font-placard font-bold tabular leading-none text-erg-ink ${
        size === 'lg' ? 'min-w-40 px-3 py-2 text-5xl tracking-wider' : 'min-w-14 px-1.5 py-0.5 text-lg'
      }`}
    >
      {digits || '----'}
    </span>
  );
}
