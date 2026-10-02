import type { Metadata } from 'next';
import Link from 'next/link';
import { FieldResponseGuide } from '@/components/field-guide';

export const metadata: Metadata = { title: '현장 대응 일반 원칙 — ChemGuard' };

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-2">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-lg text-xl text-slate-700" aria-label="검색으로">
            ←
          </Link>
          <h1 className="text-lg font-bold text-slate-900">현장 대응 일반 원칙</h1>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-4">
        <p className="mb-3 text-sm text-slate-600">물질을 모를 때의 일반 원칙입니다. 물질이 확인되면 그 물질 카드를 따르십시오.</p>
        <FieldResponseGuide />
      </main>
    </div>
  );
}
