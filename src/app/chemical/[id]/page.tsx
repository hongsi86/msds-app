import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CHEMICALS, getChemicalById } from '@/lib/chemicals-data';
import { ChemicalDetail } from './chemical-detail';

// 전 물질을 빌드 때 만들어 두어 서비스워커가 미리 저장할 수 있게 한다
export const dynamicParams = false;

export function generateStaticParams() {
  return CHEMICALS.map((c) => ({ id: c.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chemical = getChemicalById((await params).id);
  return { title: chemical ? `${chemical.name_ko} — ChemGuard` : 'ChemGuard' };
}

export default async function ChemicalPage({ params }: Props) {
  const { id } = await params;
  if (!getChemicalById(id)) notFound();

  return <ChemicalDetail id={id} />;
}
