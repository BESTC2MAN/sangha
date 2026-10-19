import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Edit3, Calendar, AlertTriangle, Info, MapPin, Check } from 'lucide-react';
import { formatDistance } from '../utils/geo';

export const RulesTab: React.FC = () => {
  const {
    squadConfig,
    currentUser,
    updateSquadConfig,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [gymName, setGymName] = useState(squadConfig.gymName);
  const [gymAddress, setGymAddress] = useState(squadConfig.gymAddress);
  const [targetCount, setTargetCount] = useState(squadConfig.weeklyTargetCount);
  const [fine3, setFine3] = useState(squadConfig.fine3Times);
  const [fine2, setFine2] = useState(squadConfig.fine2OrLess);
  const [bankName, setBankName] = useState(squadConfig.bankName);
  const [bankAccount, setBankAccount] = useState(squadConfig.bankAccount);
  const [bankHolder, setBankHolder] = useState(squadConfig.bankHolder);
  const [announcement, setAnnouncement] = useState(squadConfig.announcement);
  const [exceptionPolicy, setExceptionPolicy] = useState(squadConfig.exceptionPolicy);
  const [ruleSchedule, setRuleSchedule] = useState(squadConfig.ruleSchedule);
  const [ruleVerification, setRuleVerification] = useState(squadConfig.ruleVerification);
  const [ruleFinesNote, setRuleFinesNote] = useState(squadConfig.ruleFinesNote);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSquadConfig({
      gymName,
      gymAddress,
      weeklyTargetCount: targetCount,
      fine3Times: fine3,
      fine2OrLess: fine2,
      bankName,
      bankAccount,
      bankHolder,
      announcement,
      exceptionPolicy,
      ruleSchedule,
      ruleVerification,
      ruleFinesNote,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] p-4 transition-all hover:border-white/20 flex items-center justify-between">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <div>
          <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">
            MORE STRONG PEOPLE · CHARTER
          </span>
          <h2 className="font-['Oswald'] text-2xl font-bold tracking-wider text-slate-100 mt-0.5">
            스쿼드 공식 규칙 & 공지
          </h2>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEditing ? '수정 취소' : '규칙 및 예외 규정 수정'}</span>
        </button>
      </div>

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <form onSubmit={handleSave} className="relative rounded-2xl overflow-hidden bg-slate-950/65 backdrop-blur-xl border border-amber-500/40 shadow-[0_8px_32px_0_rgba(245,158,11,0.25)] p-5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Edit3 className="w-4 h-4" />
            <span>스쿼드 규칙 및 예외 처리 규정 편집</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* 1. Exception Policy */}
            <div>
              <label className="block text-amber-300 font-bold mb-1">
                예외 처리 및 유예 규정 (부상/출장/면제 기준)
              </label>
              <textarea
                value={exceptionPolicy}
                onChange={(e) => setExceptionPolicy(e.target.value)}
                rows={3}
                placeholder="예외 처리 및 유예 규정 내용을 입력하세요"
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-2.5 text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* 2. Announcement */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">스쿼드 상단 공지사항</label>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                rows={2}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 3. Schedule Rule Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                주간 집계 및 마감 시간 세부 규칙
              </label>
              <textarea
                value={ruleSchedule}
                onChange={(e) => setRuleSchedule(e.target.value)}
                rows={2}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 4. Verification Rule Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                출석 인정 기준 세부 규칙
              </label>
              <textarea
                value={ruleVerification}
                onChange={(e) => setRuleVerification(e.target.value)}
                rows={2}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 5. Gym & Target */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">지정 헬스장 이름</label>
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">주간 목표 횟수</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value) || 4)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200 font-['Oswald']"
                />
              </div>
            </div>

            {/* 6. Fine Amounts */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">주 3회 출석 시 벌금 (원)</label>
                <input
                  type="number"
                  step="1000"
                  value={fine3}
                  onChange={(e) => setFine3(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200 font-['Oswald']"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">주 2회 이하 시 벌금 (원)</label>
                <input
                  type="number"
                  step="1000"
                  value={fine2}
                  onChange={(e) => setFine2(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200 font-['Oswald']"
                />
              </div>
            </div>

            {/* 7. Fine Notes Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                벌금 납부 및 사용처 안내
              </label>
              <textarea
                value={ruleFinesNote}
                onChange={(e) => setRuleFinesNote(e.target.value)}
                rows={2}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 8. Bank Account */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">입금 은행</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">계좌번호</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">예금주</label>
                <input
                  type="text"
                  value={bankHolder}
                  onChange={(e) => setBankHolder(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-2 text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-slate-900 text-slate-300 rounded-lg text-xs hover:bg-slate-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>규칙 및 예외 규정 저장</span>
            </button>
          </div>
        </form>
      )}

      {/* Official Rule 1: Weekly Target & Timeline */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          1. 주간 집계 및 마감 시간
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">·</span>
            <span className="leading-relaxed">
              <strong className="text-slate-100">집계 기간:</strong> {squadConfig.ruleSchedule}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">·</span>
            <span>
              <strong className="text-slate-100">주간 목표:</strong> 매주 최소{' '}
              <span className="text-amber-400 font-bold font-['Oswald'] text-sm">
                {squadConfig.weeklyTargetCount}회
              </span>{' '}
              이상 운동 출석 필수
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">·</span>
            <span>
              <strong className="text-slate-100">1일 인정 한도:</strong> 하루에 여러 번 운동하더라도 출석은 <span className="text-amber-400 font-semibold">최대 1회</span>만 인정됩니다.
            </span>
          </li>
        </ul>
      </div>

      {/* Official Rule 2: Attendance Verification Policy */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          2. 공식 출석 인정 3대 기준
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {squadConfig.ruleVerification}
        </p>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl">
            <span className="font-bold text-slate-200 block">A. GPS 헬스장 인증</span>
            <p className="text-slate-400 mt-1 leading-relaxed">
              등록된 <strong className="text-slate-200">{squadConfig.gymName}</strong> 반경 {formatDistance(squadConfig.targetRadiusMeters)} 이내에서 위치 권한을 승인 후 현재 위치가 확인되면 출석이 즉시 승인됩니다.
            </p>
          </div>

          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl">
            <span className="font-bold text-slate-200 block">B. 헬스장 현장 사진 인증</span>
            <p className="text-slate-400 mt-1 leading-relaxed">
              앱 내 카메라로 현장 기구 또는 출석 상태를 직접 촬영합니다. 갤러리 재사용 방지를 위해 실시간 타임스탬프 워터마크가 부착됩니다.
            </p>
          </div>

          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl">
            <span className="font-bold text-slate-200 block">C. 7km 이상 달리기 완주 인증</span>
            <p className="text-slate-400 mt-1 leading-relaxed">
              야외 러닝 시 <strong className="text-sky-400">7.0km 이상</strong> 완주한 기록을 제출하면 헬스장 출석과 동일하게 1회로 공식 인정합니다. 차량 이동 등 부정행위 감지 시 무효 처리됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Official Rule 3: Fine System */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          3. 주간 벌금 기준 및 납부 규칙
        </h3>
        <div className="overflow-hidden border border-white/10 rounded-xl">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10 font-semibold">
              <tr>
                <th className="py-2.5 px-3">주간 달성 횟수</th>
                <th className="py-2.5 px-3">벌금 금액</th>
                <th className="py-2.5 px-3">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">주 {squadConfig.weeklyTargetCount}회 이상</td>
                <td className="py-2.5 px-3 font-bold text-slate-200 font-['Oswald']">0원</td>
                <td className="py-2.5 px-3 text-slate-400">목표 달성 + 스트릭 유지</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-amber-400">주 3회 출석</td>
                <td className="py-2.5 px-3 font-bold text-amber-400 font-['Oswald']">
                  {squadConfig.fine3Times.toLocaleString()}원
                </td>
                <td className="py-2.5 px-3 text-slate-400">1회 부족 (경고 단계)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-rose-400">주 2회 이하</td>
                <td className="py-2.5 px-3 font-bold text-rose-400 font-['Oswald']">
                  {squadConfig.fine2OrLess.toLocaleString()}원
                </td>
                <td className="py-2.5 px-3 text-slate-400">심각한 규율 위반</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {squadConfig.ruleFinesNote}
        </p>
      </div>

      {/* Exception Policy & Grace Period */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            예외 처리 및 유예 규정
          </h4>
          <button
            onClick={() => setIsEditing(true)}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
          >
            규정 수정
          </button>
        </div>
        <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl">
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {squadConfig.exceptionPolicy}
          </p>
        </div>
      </div>
    </div>
  );
};
