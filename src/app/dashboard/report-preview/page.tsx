'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildReportContext,
  formatDateTime,
  formatTime,
  ROLE_LABEL,
  TYPE_ICON,
  type Incident,
  type ReportContext,
} from '@/lib/incident-report';

export default function ReportPreviewPage() {
  const router = useRouter();
  const [ctx, setCtx] = useState<ReportContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('chemguard_incident') : null;
    if (!raw) {
      setError('상황판 데이터가 없습니다. 먼저 상황판에 기록을 입력하세요.');
      return;
    }
    try {
      const incident = JSON.parse(raw) as Incident;
      setCtx(buildReportContext(incident));
    } catch {
      setError('상황판 데이터를 읽을 수 없습니다.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-700 mb-4">{error}</p>
          <button onClick={() => router.push('/dashboard')} className="text-blue-700 underline text-sm">
            상황판으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!ctx) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">로딩 중…</div>;
  }

  return (
    <>
      <style>{`
        @page { size: A4; margin: 18mm 16mm 20mm 16mm; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
        }
        body { font-family: 'Pretendard', -apple-system, sans-serif; color: #0f172a; }
        .report { max-width: 178mm; margin: 0 auto; padding: 12mm 0; font-size: 10.5pt; line-height: 1.55; }
        .report h1 { font-size: 28pt; font-weight: 800; letter-spacing: -0.035em; margin: 0 0 4mm 0; }
        .report .lede { font-size: 11pt; color: #334155; margin: 0 0 8mm 0; }
        .report h2 { font-size: 12pt; font-weight: 700; letter-spacing: -0.02em; margin: 8mm 0 3mm 0; padding-bottom: 1.5mm; border-bottom: 1px solid #e2e8f0; }
        .report .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm; font-size: 9.5pt; margin: 4mm 0 4mm 0; }
        .report .meta .lab { color: #94a3b8; font-size: 8.5pt; letter-spacing: 0.08em; text-transform: uppercase; }
        .report .meta .val { color: #0f172a; font-weight: 500; }
        .report .casualty { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
        .report .casualty div { border: 1px solid #e2e8f0; border-radius: 2mm; padding: 4mm; }
        .report .casualty .lab { font-size: 8.5pt; color: #64748b; }
        .report .casualty .val { font-size: 16pt; font-weight: 800; color: #0f172a; margin-top: 1mm; }
        .report .roles { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
        .report .role-row { border: 1px solid #e2e8f0; border-radius: 2mm; padding: 3mm; font-size: 9.5pt; }
        .report .role-row .name { font-weight: 600; margin-bottom: 1mm; }
        .report .role-row .bar { height: 2mm; background: #f1f5f9; border-radius: 1mm; overflow: hidden; margin-top: 1.5mm; }
        .report .role-row .bar > div { height: 100%; background: #1d4ed8; }
        .report .timeline { display: flex; flex-direction: column; gap: 2mm; }
        .report .ev { display: grid; grid-template-columns: 18mm 14mm 1fr; gap: 3mm; font-size: 9.5pt; padding: 2mm 0; border-bottom: 1px dashed #e2e8f0; align-items: start; }
        .report .ev .ts { font-family: 'SF Mono', Menlo, monospace; color: #64748b; }
        .report .ev .role { font-weight: 700; color: #1d4ed8; }
        .report .ev .msg { color: #0f172a; }
        .report .ev .ico { display: inline-block; width: 4mm; text-align: center; margin-right: 1mm; color: #64748b; }
        .report .footer { margin-top: 12mm; font-size: 8.5pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4mm; line-height: 1.6; }
      `}</style>

      <div className="no-print flex items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
        <button onClick={() => router.push('/dashboard')} className="text-sm text-slate-600">← 상황판</button>
        <span className="flex-1 text-sm text-slate-700">사고 보고서 미리보기</span>
        <button onClick={() => window.print()} className="rounded bg-slate-900 text-white px-4 py-2 text-sm font-medium">
          PDF로 저장 (인쇄)
        </button>
      </div>

      <div className="report">
        <p style={{ fontSize: '9pt', letterSpacing: '0.2em', color: '#64748b', fontWeight: 600, marginBottom: '4mm' }}>
          INCIDENT REPORT · 사고 종료 보고서
        </p>
        <h1>{ctx.incident.title}</h1>
        <p className="lede">
          본 보고서는 ChemGuard 상황판에 기록된 타임라인 · 체크리스트 · 사상자 집계를 바탕으로 자동
          생성되었다. 사고 ID <strong>{ctx.incident.id}</strong>, 작성 시각 {ctx.generatedAt}.
        </p>

        <div className="meta">
          <div>
            <div className="lab">물질</div>
            <div className="val">{ctx.incident.chemical_name}</div>
          </div>
          <div>
            <div className="lab">개시 시각</div>
            <div className="val">{formatDateTime(ctx.incident.created_at)}</div>
          </div>
          <div>
            <div className="lab">심각도</div>
            <div className="val">{ctx.severityLabel}</div>
          </div>
          <div>
            <div className="lab">현재 상태</div>
            <div className="val">{ctx.statusLabel}</div>
          </div>
          <div>
            <div className="lab">경과 시간</div>
            <div className="val">{ctx.elapsed}</div>
          </div>
          <div>
            <div className="lab">체크리스트 진행률</div>
            <div className="val">{ctx.progressPct}% ({ctx.doneChecks}/{ctx.totalChecks})</div>
          </div>
        </div>

        <h2>사상자 집계</h2>
        <div className="casualty">
          <div>
            <div className="lab">부상</div>
            <div className="val">{ctx.incident.injured}</div>
          </div>
          <div>
            <div className="lab">사망</div>
            <div className="val">{ctx.incident.deceased}</div>
          </div>
          <div>
            <div className="lab">대피</div>
            <div className="val">{ctx.incident.evacuated}</div>
          </div>
        </div>

        <h2>역할별 체크리스트 진행</h2>
        <div className="roles">
          {ctx.byRole.map((r) => (
            <div key={r.role} className="role-row">
              <div className="name">{r.label}</div>
              <div style={{ color: '#64748b', fontSize: '9pt' }}>
                {r.done} / {r.total} 완료 ({r.total ? Math.round((r.done / r.total) * 100) : 0}%)
              </div>
              <div className="bar">
                <div style={{ width: `${r.total ? (r.done / r.total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <h2>타임라인</h2>
        <div className="timeline">
          {ctx.incident.timeline.map((ev) => (
            <div key={ev.id} className="ev">
              <span className="ts">{formatTime(ev.timestamp)}</span>
              <span className="role">{ROLE_LABEL[ev.role].replace(/^[^ ]+ /, '')}</span>
              <span className="msg">
                <span className="ico">{TYPE_ICON[ev.type]}</span>
                {ev.message}
              </span>
            </div>
          ))}
        </div>

        {ctx.decisions.length > 0 && (
          <>
            <h2>주요 결정·조치 이력</h2>
            <div className="timeline">
              {ctx.decisions.map((ev) => (
                <div key={`d-${ev.id}`} className="ev">
                  <span className="ts">{formatTime(ev.timestamp)}</span>
                  <span className="role">{ev.role}</span>
                  <span className="msg">{ev.message}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="footer">
          본 문서는 ChemGuard 상황판 데이터에서 자동 생성되었다. 공식 보고용으로 사용 시 소속 기관의
          서식에 맞춰 재작성하라. 법적 효력을 가진 보고는 소속 기관 공식 채널을 통해 제출되어야 한다.<br />
          ChemGuard · 대한화학손상연구회(KRSCI) · msds-app-pearl.vercel.app
        </div>
      </div>
    </>
  );
}
