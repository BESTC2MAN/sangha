import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertOctagon, Copy, Check, ShieldCheck, Clock } from 'lucide-react';

export const FinesTab: React.FC = () => {
  const {
    currentUser,
    members,
    squadConfig,
    submitFinePayment,
    approveFinePayment,
    switchUser,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState(currentUser.name.replace(' (나)', ''));
  const [paymentAmount, setPaymentAmount] = useState<number>(currentUser.unpaidFineAmount || 10000);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${squadConfig.bankName} ${squadConfig.bankAccount}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFinePayment(paymentAmount, senderName);
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 3000);
  };

  // Admin pending list
  const pendingApprovals = members.filter((m) => m.pendingPayment?.status === 'pending');

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header with MORE STRONG PEOPLE */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] p-4 transition-all hover:border-white/20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent pointer-events-none" />
        <span className="text-[11px] text-rose-400 font-bold uppercase tracking-wider">
          MORE STRONG PEOPLE · FINES
        </span>
        <h2 className="font-['Oswald'] text-2xl font-bold tracking-wider text-slate-100 mt-0.5">
          벌금 관리소
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          주간 목표 미달성 시 정해진 규칙에 따라 벌금을 납부하며 서로의 책임을 강화합니다.
        </p>
      </div>

      {/* 1. Personal Fine Status Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-5 transition-all hover:border-white/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">내 벌금 납부 현황</span>
          {currentUser.unpaidFineAmount > 0 ? (
            <span className="text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-400/40 px-2.5 py-0.5 rounded-lg shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              미납 상태
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              미납 벌금 없음
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">납부 예정 벌금</span>
            <span className="font-['Oswald'] text-4xl font-bold tracking-tight text-slate-100 tabular-nums">
              {currentUser.unpaidFineAmount.toLocaleString()}
              <span className="text-xl ml-1 text-slate-400">원</span>
            </span>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <span>주 3회 출석: {squadConfig.fine3Times.toLocaleString()}원</span>
            <br />
            <span>주 2회 이하: {squadConfig.fine2OrLess.toLocaleString()}원</span>
          </div>
        </div>

        {/* Bank Details Card with One-Click Copy */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">입금 은행</span>
            <span className="font-semibold text-slate-200">{squadConfig.bankName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">계좌번호</span>
            <span className="font-mono font-bold text-slate-100 text-sm">
              {squadConfig.bankAccount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">예금주</span>
            <span className="text-slate-300 font-medium">{squadConfig.bankHolder}</span>
          </div>

          <button
            onClick={handleCopyAccount}
            className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '계좌번호가 복사되었습니다!' : '계좌번호 복사하기'}</span>
          </button>
        </div>

        {/* Payment Confirmation Submission */}
        {currentUser.pendingPayment ? (
          <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold block">납부 확인 신청 완료 (방장 승인 대기 중)</span>
                <span className="text-[11px] text-amber-400/80 font-mono">
                  {currentUser.pendingPayment.senderName} 님 ·{' '}
                  {currentUser.pendingPayment.amount.toLocaleString()}원 송금 확인 요청
                </span>
              </div>
            </div>
          </div>
        ) : currentUser.unpaidFineAmount > 0 ? (
          <form onSubmit={handlePaymentSubmit} className="pt-2 border-t border-white/10 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              계좌 이체 후 납부 완료 신청
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">보낸 분 이름</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">송금 금액 (원)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-['Oswald'] tabular-nums focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-[0_4px_20px_rgba(225,29,72,0.4)]"
            >
              벌금 송금 완료 신청하기
            </button>
          </form>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            현재 미납된 벌금이 없습니다. 훌륭한 자기관리입니다!
          </div>
        )}

        {submittedNotice && (
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>납부 신청이 방장에게 전달되었습니다. 입금 확인 후 반영됩니다.</span>
          </div>
        )}
      </div>

      {/* 2. Group Admin Verification Queue */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            방장 권한: 벌금 입금 확인 & 승인
          </h3>
          {currentUser.role !== 'leader' && (
            <span className="text-[10px] text-slate-500">방장만 승인 가능</span>
          )}
        </div>

        {currentUser.role !== 'leader' && (
          <div className="p-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span>방장(김철수) 계정으로 전환하면 입금 승인을 테스트할 수 있습니다.</span>
            <button
              onClick={() => switchUser('user_cheolsu')}
              className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px] shrink-0 ml-2 shadow-md"
            >
              방장으로 전환
            </button>
          </div>
        )}

        {pendingApprovals.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            현재 확인 대기 중인 벌금 납부 건이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pendingApprovals.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${m.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-md`}
                  >
                    {m.avatarInitials}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">{m.name}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      신청자: {m.pendingPayment?.senderName} ({m.pendingPayment?.submittedAt})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-['Oswald'] text-sm font-bold text-rose-400 tabular-nums">
                    {m.pendingPayment?.amount.toLocaleString()}원
                  </span>
                  {currentUser.role === 'leader' ? (
                    <button
                      onClick={() => approveFinePayment(m.id)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    >
                      입금 확인
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500">대기 중</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Squad Fine Pot & History */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-3">
        <h3 className="text-sm font-bold text-slate-200">스쿼드 전체 벌금 현황</h3>
        <div className="divide-y divide-white/5">
          {members.map((m) => (
            <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{m.name}</span>
              <div className="flex items-center gap-3">
                {m.unpaidFineAmount > 0 ? (
                  <span className="font-['Oswald'] text-rose-400 font-bold tabular-nums">
                    {m.unpaidFineAmount.toLocaleString()}원 미납
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">정산 완료</span>
                )}
                {m.id !== currentUser.id && m.unpaidFineAmount > 0 && (
                  <button
                    onClick={() => switchUser(m.id)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                  >
                    이 사용자로 납부 테스트
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
