import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const MondaySettlementModal: React.FC<Props> = ({ onClose }) => {
  const { settlementSummary, squadConfig, currentUser } = useApp();

  if (!settlementSummary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/75 backdrop-blur-2xl border border-white/10 w-full max-w-md p-5 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/80 border border-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            AUTOMATED SETTLEMENT
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">
            월요일 06:00 주간 출석 정산 결과
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            지난 한 주간의 운동 횟수를 집계하여 벌금 대상자를 확정했습니다.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 block">목표 달성 멤버</span>
            <span className="font-['Oswald'] text-xl font-bold text-emerald-400 tabular-nums">
              {settlementSummary.achieversCount} / {settlementSummary.totalMembers}명
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 block">신규 발생 벌금 총액</span>
            <span className="font-['Oswald'] text-xl font-bold text-rose-400 tabular-nums">
              {settlementSummary.totalFinesCollected.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Member breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">멤버별 정산 내역</span>
          <div className="divide-y divide-slate-800/80 bg-slate-950 border border-slate-800 rounded-xl px-3">
            {settlementSummary.memberResults.map((res) => (
              <div key={res.userId} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {res.achieved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-200">{res.userName}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5 font-['Oswald']">
                      {res.count}/{res.target}회
                    </span>
                  </div>
                </div>

                <div>
                  {res.achieved ? (
                    <span className="text-emerald-400 font-semibold text-xs">0원 (달성)</span>
                  ) : (
                    <span className="font-['Oswald'] font-bold text-rose-400 text-sm tabular-nums">
                      +{res.fineAmount.toLocaleString()}원 벌금
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          확인하고 새로운 주차 시작하기
        </button>
      </div>
    </div>
  );
};
