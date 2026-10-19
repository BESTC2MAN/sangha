import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ChevronRight, Copy, AlertTriangle, Trophy, MapPin } from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { WeeklyAttendanceCalendar } from './WeeklyAttendanceCalendar';

export const HomeTab: React.FC = () => {
  const {
    currentUser,
    members,
    squadConfig,
    setActiveTab,
  } = useApp();

  const [copiedAccount, setCopiedAccount] = React.useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${squadConfig.bankName} ${squadConfig.bankAccount}`);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const remainingToTarget = Math.max(0, squadConfig.weeklyTargetCount - currentUser.weeklyCount);
  const isTargetAchieved = currentUser.weeklyCount >= squadConfig.weeklyTargetCount;
  const progressPercent = Math.min(
    100,
    Math.round((currentUser.weeklyCount / squadConfig.weeklyTargetCount) * 100)
  );

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Fine Banner (Only shown if user has unpaid fine) */}
      {currentUser.unpaidFineAmount > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 shadow-[0_8px_32px_0_rgba(225,29,72,0.25)] p-4 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase">
                  목표 미달성 벌금 고지
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5 font-['Plus_Jakarta_Sans']">
                  납부 예정 벌금{' '}
                  <span className="font-['Oswald'] text-xl text-rose-400 tabular-nums font-bold">
                    {currentUser.unpaidFineAmount.toLocaleString()}원
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  지난주 운동 횟수가 기준(4회)에 미달했습니다. 그룹 계좌로 송금 후 납부 완료를 신청해주세요.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-slate-300 font-mono text-xs">
              <span className="text-slate-400">{squadConfig.bankName}</span> {squadConfig.bankAccount}
              <span className="text-slate-400 ml-1">({squadConfig.bankHolder})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAccount}
                className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAccount ? '복사됨!' : '계좌 복사'}</span>
              </button>
              <button
                onClick={() => setActiveTab('fines')}
                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-rose-900/40"
              >
                납부 신청하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Card: Changed H2 to MORE STRONG PEOPLE with Glassmorphism */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-5 transition-all hover:border-white/20">
        {/* Subtle luminous top border sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase">
            SQUAD DISCIPLINE
          </span>
          <span className="font-mono text-slate-400 text-[11px]">이번 주 진행 중</span>
        </div>

        {/* User requested H2: MORE STRONG PEOPLE */}
        <h2 className="font-['Oswald'] text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
          MORE STRONG PEOPLE
        </h2>

        <div className="flex items-end justify-between mt-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">내 주간 출석 현황</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-['Oswald'] text-5xl font-extrabold tracking-tight text-slate-100 tabular-nums">
                {currentUser.weeklyCount}
              </span>
              <span className="font-['Oswald'] text-2xl font-bold text-slate-500">
                / {squadConfig.weeklyTargetCount}회
              </span>
            </div>
          </div>

          <div className="text-right">
            {isTargetAchieved ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>주간 목표 달성!</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-amber-400">
                목표까지 {remainingToTarget}회 남음
              </span>
            )}
            <div className="text-[11px] text-slate-400 mt-1">
              {currentUser.streakWeeks > 0 ? (
                <span className="text-amber-400/90 font-medium">{currentUser.streakWeeks}주 연속 달성 중 🔥</span>
              ) : (
                <span>연속 달성 시작하기</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-900/80 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                isTargetAchieved
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                  : 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-mono tabular-nums">
            <span>월 00:00 시작</span>
            <span className="text-slate-300 font-bold">달성률 {progressPercent}%</span>
            <span>일 23:59 마감</span>
          </div>
        </div>

        {/* Quick Action CTA inside Hero */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-slate-400 block text-[11px]">오늘 출석 상태</span>
            {currentUser.hasAttendedToday ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> 오늘 출석 완료
              </span>
            ) : (
              <span className="text-amber-400 font-semibold mt-0.5 block text-xs">
                아직 인증하지 않았습니다
              </span>
            )}
          </div>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              currentUser.hasAttendedToday
                ? 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-white/10'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95'
            }`}
          >
            <span>{currentUser.hasAttendedToday ? '인증 기록 확인' : '지금 운동 인증하기'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Requested Weekly Calendar Matrix (월 화 수 목 금 토 일 x 멤버 O / X) */}
      <WeeklyAttendanceCalendar />

      {/* 4. Designated Gym Location Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">지정 인증 헬스장</span>
            <h4 className="text-sm font-bold text-slate-100">{squadConfig.gymName}</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              반경 {formatDistance(squadConfig.targetRadiusMeters)} 이내 출석 인정
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('verify')}
          className="px-3 py-1.5 bg-slate-900/70 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
        >
          GPS 측정
        </button>
      </div>
    </div>
  );
};
