import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Copy, Check, Flame, Trophy, Coins, AlertTriangle, Calendar } from 'lucide-react';
import { WeeklyAttendanceCalendar } from './WeeklyAttendanceCalendar';

export const SquadTab: React.FC = () => {
  const {
    squadConfig,
    members,
    currentUser,
    switchUser,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(true);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(squadConfig.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Squad metrics
  const totalWeeklyWorkouts = members.reduce((acc, m) => acc + m.weeklyCount, 0);
  const totalTargetWorkouts = members.length * squadConfig.weeklyTargetCount;
  const squadCompletionRate = Math.round((totalWeeklyWorkouts / totalTargetWorkouts) * 100);
  const totalUnpaidFines = members.reduce((acc, m) => acc + m.unpaidFineAmount, 0);

  return (
    <div className="space-y-4 pb-8">
      {/* Squad Header Card with H2 MORE STRONG PEOPLE & Glassmorphism */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] p-5 transition-all hover:border-white/20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">
              SQUAD DASHBOARD
            </span>
            {/* User requested H2: MORE STRONG PEOPLE */}
            <h2 className="font-['Oswald'] text-2xl font-bold tracking-wider text-slate-100 mt-0.5">
              MORE STRONG PEOPLE
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              평택 고덕 라이트짐 기반 상호 감시 및 운동 습관 크루
            </p>
          </div>

          <button
            onClick={handleCopyInvite}
            className="px-3 py-1.5 bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-lg"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="font-mono">{copiedCode ? '복사완료' : squadConfig.inviteCode}</span>
          </button>
        </div>

        {/* Squad Overall Progress */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-baseline text-xs mb-1.5">
            <span className="text-slate-400 font-medium">스쿼드 전체 목표 달성률</span>
            <span className="font-['Oswald'] text-sm font-bold text-slate-200 tabular-nums">
              {totalWeeklyWorkouts} / {totalTargetWorkouts}회 ({squadCompletionRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              style={{ width: `${squadCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Toggle: List vs Weekly Calendar */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          출석 모니터링
        </h3>
        <button
          onClick={() => setShowCalendarView(!showCalendarView)}
          className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{showCalendarView ? '멤버 카드 보기' : '주간 O/X 캘린더 보기'}</span>
        </button>
      </div>

      {/* Weekly O/X Calendar Matrix View */}
      {showCalendarView ? (
        <WeeklyAttendanceCalendar />
      ) : null}

      {/* Squad Fine Pot & Penalty Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>누적 벌금 금고</span>
          </div>
          <span className="font-['Oswald'] text-2xl font-bold text-slate-100 tabular-nums">
            {squadConfig.totalFinePool.toLocaleString()}원
          </span>
          <p className="text-[11px] text-slate-400 mt-1">연말 회식 및 우수자 보상용</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-rose-500/20 shadow-[0_8px_32px_0_rgba(225,29,72,0.2)] p-4 transition-all hover:border-rose-500/40">
          <div className="flex items-center gap-2 text-xs text-rose-400 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>현재 전체 미납 벌금</span>
          </div>
          <span className="font-['Oswald'] text-2xl font-bold text-rose-400 tabular-nums">
            {totalUnpaidFines.toLocaleString()}원
          </span>
          <p className="text-[11px] text-slate-400 mt-1">납부 대기 중인 벌금 합계</p>
        </div>
      </div>

      {/* Member List & Individual Status */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            멤버별 주간 출석 현황 ({members.length}명)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">목표: 주 {squadConfig.weeklyTargetCount}회</span>
        </div>

        <div className="divide-y divide-white/5">
          {members.map((member) => {
            const isMe = member.id === currentUser.id;
            const isAchieved = member.weeklyCount >= squadConfig.weeklyTargetCount;
            const hasFine = member.unpaidFineAmount > 0;

            return (
              <div
                key={member.id}
                className={`py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 ${
                  isMe ? 'bg-amber-500/10 -mx-2 px-2 rounded-xl' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md`}
                  >
                    {member.avatarInitials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {member.name}
                      </span>
                      {member.role === 'leader' && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 border border-amber-400/30 px-1 rounded">
                          방장
                        </span>
                      )}
                      {member.hasAttendedToday && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-400/30 px-1 rounded">
                          오늘 출석
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      {member.streakWeeks > 0 ? (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Flame className="w-3 h-3 fill-current" /> {member.streakWeeks}주 연속
                        </span>
                      ) : (
                        <span>스트릭 없음</span>
                      )}
                      {hasFine && (
                        <span className="text-rose-400 font-semibold">
                          · 벌금 {member.unpaidFineAmount.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1 font-['Oswald']">
                      <span
                        className={`text-lg font-bold tabular-nums ${
                          isAchieved ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {member.weeklyCount}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {squadConfig.weeklyTargetCount}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] block font-medium ${
                        isAchieved ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isAchieved
                        ? '목표 달성'
                        : `-${squadConfig.weeklyTargetCount - member.weeklyCount}회 부족`}
                    </span>
                  </div>

                  {/* Switch to this user for quick testing */}
                  {!isMe && (
                    <button
                      onClick={() => switchUser(member.id)}
                      className="px-2 py-1 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 rounded text-[11px] transition-colors"
                      title="이 멤버로 전환하여 보기"
                    >
                      전환
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Friends Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20">
        <h4 className="text-xs font-bold text-slate-300 mb-1">친구 초대하기</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          초대 코드 <span className="font-mono text-amber-400 font-bold">{squadConfig.inviteCode}</span>를 공유하여 친구를 스쿼드에 초대하고 함께 운동 습관을 감시하세요.
        </p>
        <button
          onClick={handleCopyInvite}
          className="mt-3 w-full py-2 bg-slate-900/70 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copiedCode ? '초대 코드 복사 완료!' : '초대 코드 복사하기'}</span>
        </button>
      </div>
    </div>
  );
};
