import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, Footprints, Camera, MapPin } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface DayColumn {
  key: string;
  label: string; // 월, 화, 수, 목, 금, 토, 일
  dateStr: string; // YYYY-MM-DD
  dayNum: number;
  isToday: boolean;
}

export const WeeklyAttendanceCalendar: React.FC = () => {
  const { members, attendanceLogs, squadConfig, currentUser } = useApp();
  const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = current week, -1 = last week
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    memberId: string;
    memberName: string;
    date: string;
    log?: AttendanceRecord;
  } | null>(null);

  // Generate current week dates (Mon 2026-10-12 to Sun 2026-10-18) with offset support
  const days: DayColumn[] = [
    { key: 'mon', label: '월', dateStr: weekOffset === 0 ? '2026-10-12' : '2026-10-05', dayNum: weekOffset === 0 ? 12 : 5, isToday: false },
    { key: 'tue', label: '화', dateStr: weekOffset === 0 ? '2026-10-13' : '2026-10-06', dayNum: weekOffset === 0 ? 13 : 6, isToday: false },
    { key: 'wed', label: '수', dateStr: weekOffset === 0 ? '2026-10-14' : '2026-10-07', dayNum: weekOffset === 0 ? 14 : 7, isToday: false },
    { key: 'thu', label: '목', dateStr: weekOffset === 0 ? '2026-10-15' : '2026-10-08', dayNum: weekOffset === 0 ? 15 : 8, isToday: false },
    { key: 'fri', label: '금', dateStr: weekOffset === 0 ? '2026-10-16' : '2026-10-09', dayNum: weekOffset === 0 ? 16 : 9, isToday: false },
    { key: 'sat', label: '토', dateStr: weekOffset === 0 ? '2026-10-17' : '2026-10-10', dayNum: weekOffset === 0 ? 17 : 10, isToday: false },
    { key: 'sun', label: '일', dateStr: weekOffset === 0 ? '2026-10-18' : '2026-10-11', dayNum: weekOffset === 0 ? 18 : 11, isToday: weekOffset === 0 },
  ];

  const weekTitle = weekOffset === 0 ? '이번 주 (10/12 ~ 10/18)' : '지난 주 (10/05 ~ 10/11)';

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] p-4 transition-all hover:border-white/20">
      {/* Top Glass Luster Sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              주간 출석 캘린더
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {weekTitle}
            </span>
          </div>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setWeekOffset(-1)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              weekOffset === -1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            지난주
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              weekOffset === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            이번주
          </button>
        </div>
      </div>

      {/* Responsive Matrix Grid */}
      <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2.5 px-1.5 text-left text-xs font-bold text-slate-400 w-24 shrink-0">
                멤버
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className={`py-2 px-1 text-xs font-bold transition-colors ${
                    day.isToday
                      ? 'text-amber-400 bg-amber-500/10 rounded-t-lg'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="block text-[11px]">{day.label}</span>
                  <span className="text-[10px] font-mono opacity-60 tabular-nums">
                    {day.dayNum}
                  </span>
                </th>
              ))}
              <th className="py-2.5 px-2 text-right text-xs font-bold text-slate-400 w-14">
                달성
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {members.map((member) => {
              const isCurrentUser = member.id === currentUser.id;

              // Count total attended days in this displayed week
              const attendedDaysInWeek = days.filter((day) =>
                attendanceLogs.some(
                  (log) => log.userId === member.id && log.date === day.dateStr
                )
              );
              const weeklyCount = attendedDaysInWeek.length;
              const isAchieved = weeklyCount >= squadConfig.weeklyTargetCount;

              // Friendly display name (e.g. "상하", "김철수(나)")
              const shortName = member.name.includes('(상하)')
                ? '상하'
                : member.name.replace(' (나)', '(나)');

              return (
                <tr
                  key={member.id}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-amber-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Member Name */}
                  <td className="py-2.5 px-1.5 text-left font-medium">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full ${member.avatarBg} text-white flex items-center justify-center font-bold text-[9px] shrink-0`}
                      >
                        {member.avatarInitials}
                      </div>
                      <span
                        className={`truncate text-xs ${
                          isCurrentUser
                            ? 'font-bold text-amber-300'
                            : 'font-semibold text-slate-200'
                        }`}
                        title={member.name}
                      >
                        {shortName}
                      </span>
                    </div>
                  </td>

                  {/* Days Mon-Sun (월 화 수 목 금 토 일) */}
                  {days.map((day) => {
                    const log = attendanceLogs.find(
                      (l) => l.userId === member.id && l.date === day.dateStr
                    );
                    const attended = !!log;

                    return (
                      <td
                        key={day.key}
                        className={`py-2 px-1 text-center ${
                          day.isToday ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCellInfo({
                              memberId: member.id,
                              memberName: member.name,
                              date: day.dateStr,
                              log,
                            })
                          }
                          className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center font-bold transition-all text-xs ${
                            attended
                              ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 hover:scale-110 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                              : 'bg-slate-900/40 border border-white/5 text-slate-600 hover:text-slate-400'
                          }`}
                          title={
                            attended
                              ? `${member.name}: ${day.label}요일 운동 완료 (${log.type})`
                              : `${member.name}: ${day.label}요일 미출석`
                          }
                        >
                          {attended ? (
                            <span className="font-['Oswald'] text-sm tracking-tight text-emerald-300 font-extrabold">
                              O
                            </span>
                          ) : (
                            <span className="font-['Oswald'] text-xs font-semibold text-slate-600">
                              X
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Summary / Total */}
                  <td className="py-2.5 px-2 text-right">
                    <span
                      className={`font-['Oswald'] font-bold text-xs tabular-nums ${
                        isAchieved ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {weeklyCount}/{squadConfig.weeklyTargetCount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Detail Popover */}
      {selectedCellInfo && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">
                {selectedCellInfo.memberName}
              </span>
              <span className="text-slate-400 ml-1">
                ({selectedCellInfo.date})
              </span>
              {selectedCellInfo.log ? (
                <span className="text-emerald-400 font-semibold block mt-0.5">
                  {selectedCellInfo.log.type === 'gps' && '📍 GPS 현장 출석 완료 (라이트짐)'}
                  {selectedCellInfo.log.type === 'photo' && '📷 헬스장 현장 사진 인증 완료'}
                  {selectedCellInfo.log.type === 'run' && `🏃 7km+ 러닝 완주 (${selectedCellInfo.log.runDistanceKm}km)`}
                  {selectedCellInfo.log.note && ` · "${selectedCellInfo.log.note}"`}
                </span>
              ) : (
                <span className="text-slate-500 block mt-0.5">
                  이 날짜에는 운동 인증 기록이 없습니다 (X)
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedCellInfo(null)}
            className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-800/80 rounded"
          >
            닫기
          </button>
        </div>
      )}

      {/* Legend & Note */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-[10px] text-center leading-3">
              O
            </span>
            인증 성공
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3.5 h-3.5 rounded bg-slate-900/40 border border-white/5 text-slate-600 font-bold text-[10px] text-center leading-3">
              X
            </span>
            미출석
          </span>
        </div>
        <span className="text-amber-400/80 font-medium">
          목표: 주 4회 이상
        </span>
      </div>
    </div>
  );
};
