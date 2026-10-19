import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Check, X, Shield, AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<Props> = ({ onClose }) => {
  const { members, currentUserId, switchUser, squadConfig } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/80 backdrop-blur-2xl border border-white/10 w-full max-w-sm p-5 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] space-y-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/80 border border-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            TEST PERSONA SWITCHER
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">멤버 프로필 전환</h3>
          <p className="text-xs text-slate-400 mt-1">
            방장, 4회 달성자, 벌금 대상자 등 다양한 멤버 시점에서 앱의 모든 기능을 즉시 테스트할 수 있습니다.
          </p>
        </div>

        <div className="space-y-2">
          {members.map((member) => {
            const isSelected = member.id === currentUserId;

            return (
              <button
                key={member.id}
                onClick={() => {
                  switchUser(member.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                  >
                    {member.avatarInitials}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200">{member.name}</span>
                      {member.role === 'leader' && (
                        <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/80 border border-amber-800 px-1 rounded">
                          방장
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      이번 주 {member.weeklyCount}/{squadConfig.weeklyTargetCount}회 ·{' '}
                      {member.unpaidFineAmount > 0 ? (
                        <span className="text-rose-400 font-semibold">
                          벌금 {member.unpaidFineAmount.toLocaleString()}원
                        </span>
                      ) : (
                        <span className="text-emerald-400">벌금 없음</span>
                      )}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
