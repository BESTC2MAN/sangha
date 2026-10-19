import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Users, CheckCircle2, AlertOctagon, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, members } = useApp();

  const hasUnpaidFine = currentUser.unpaidFineAmount > 0;
  const pendingApprovalsCount =
    currentUser.role === 'leader'
      ? members.filter((m) => m.pendingPayment?.status === 'pending').length
      : 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/45 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.5)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">홈</span>
        </button>

        {/* Tab 2: Squad */}
        <button
          onClick={() => setActiveTab('squad')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'squad' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">스쿼드</span>
        </button>

        {/* Tab 3: Verify (Primary Action Center) */}
        <button
          onClick={() => setActiveTab('verify')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-transform active:scale-95 ${
            activeTab === 'verify' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`w-10 h-10 -mt-3 rounded-full flex items-center justify-center border transition-all ${
              activeTab === 'verify'
                ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                : 'bg-slate-900/80 border-white/10 text-slate-300 shadow-md'
            }`}
          >
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-semibold mt-0.5">인증하기</span>
        </button>

        {/* Tab 4: Fines */}
        <button
          onClick={() => setActiveTab('fines')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'fines' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">벌금소</span>
          {hasUnpaidFine && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
          {pendingApprovalsCount > 0 && !hasUnpaidFine && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
        </button>

        {/* Tab 5: Rules */}
        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'rules' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-1">규칙</span>
        </button>
      </div>
    </nav>
  );
};
