import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AttendanceRecord, Member, SquadConfig, SettlementSummary, VerificationType } from '../types';
import { INITIAL_SQUAD_CONFIG, INITIAL_MEMBERS, INITIAL_ATTENDANCE_LOGS } from '../data/initialData';
import { WALLPAPERS } from '../data/wallpapers';

interface AppContextType {
  currentUserId: string;
  currentUser: Member;
  members: Member[];
  squadConfig: SquadConfig;
  attendanceLogs: AttendanceRecord[];
  activeWallpaperId: string;
  overlayOpacity: number;
  activeTab: 'home' | 'squad' | 'verify' | 'fines' | 'rules';
  settlementSummary: SettlementSummary | null;
  isSettlementModalOpen: boolean;
  unlockedWallpapers: string[];

  // Actions
  setActiveTab: (tab: 'home' | 'squad' | 'verify' | 'fines' | 'rules') => void;
  switchUser: (userId: string) => void;
  verifyWorkout: (params: {
    type: VerificationType;
    gymName?: string;
    distanceToGymMeters?: number;
    photoUrl?: string;
    runDistanceKm?: number;
    runDurationMinutes?: number;
    runPace?: string;
    note?: string;
  }) => { success: boolean; message: string };
  triggerMondaySettlement: () => void;
  submitFinePayment: (amount: number, senderName: string) => void;
  approveFinePayment: (memberId: string) => void;
  updateSquadConfig: (updates: Partial<SquadConfig>) => void;
  selectWallpaper: (id: string) => void;
  setOverlayOpacity: (opacity: number) => void;
  setSettlementModalOpen: (open: boolean) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'iron_code_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [currentUserId, setCurrentUserId] = useState<string>('user_cheolsu');
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [squadConfig, setSquadConfig] = useState<SquadConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
      return saved ? JSON.parse(saved) : INITIAL_SQUAD_CONFIG;
    } catch {
      return INITIAL_SQUAD_CONFIG;
    }
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
    } catch {
      return INITIAL_ATTENDANCE_LOGS;
    }
  });

  const [activeWallpaperId, setActiveWallpaperId] = useState<string>('iron_gym');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<'home' | 'squad' | 'verify' | 'fines' | 'rules'>('home');
  const [settlementSummary, setSettlementSummary] = useState<SettlementSummary | null>(null);
  const [isSettlementModalOpen, setSettlementModalOpen] = useState<boolean>(false);
  const [unlockedWallpapers, setUnlockedWallpapers] = useState<string[]>([
    'iron_gym',
    'iron_boxing',
    'iron_running',
  ]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
      localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(squadConfig));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(attendanceLogs));
    } catch (e) {
      console.warn('Failed to sync to localStorage', e);
    }
  }, [members, squadConfig, attendanceLogs]);

  const currentUser = members.find((m) => m.id === currentUserId) || members[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const selectWallpaper = (id: string) => {
    setActiveWallpaperId(id);
  };

  const cycleToNextWallpaper = () => {
    const list = WALLPAPERS.filter((w) => unlockedWallpapers.includes(w.id));
    const currentIndex = list.findIndex((w) => w.id === activeWallpaperId);
    const nextIndex = (currentIndex + 1) % list.length;
    setActiveWallpaperId(list[nextIndex].id);
  };

  // Workout verification
  const verifyWorkout = (params: {
    type: VerificationType;
    gymName?: string;
    distanceToGymMeters?: number;
    photoUrl?: string;
    runDistanceKm?: number;
    runDurationMinutes?: number;
    runPace?: string;
    note?: string;
  }): { success: boolean; message: string } => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('ko-KR', { hour12: false });

    // 1-per-day enforcement rule from PRD:
    // Check if user already attended today
    const alreadyAttendedToday = attendanceLogs.some(
      (log) => log.userId === currentUserId && log.date === todayStr
    );

    if (alreadyAttendedToday) {
      return {
        success: false,
        message: '오늘은 이미 출석 인증을 완료하셨습니다. (하루 최대 1회 인정)',
      };
    }

    const newLog: AttendanceRecord = {
      id: `att_${Date.now()}`,
      userId: currentUserId,
      userName: currentUser.name,
      date: todayStr,
      time: nowTimeStr,
      type: params.type,
      gymName: params.gymName || squadConfig.gymName,
      distanceToGymMeters: params.distanceToGymMeters,
      photoUrl: params.photoUrl,
      runDistanceKm: params.runDistanceKm,
      runDurationMinutes: params.runDurationMinutes,
      runPace: params.runPace,
      note: params.note,
      verified: true,
    };

    const newLogs = [newLog, ...attendanceLogs];
    setAttendanceLogs(newLogs);

    // Update user's weekly count and attended flag
    const updatedMembers = members.map((m) => {
      if (m.id === currentUserId) {
        const nextCount = m.weeklyCount + 1;
        // Check if weekly goal unlocked
        if (nextCount >= squadConfig.weeklyTargetCount && !unlockedWallpapers.includes('iron_champion')) {
          setUnlockedWallpapers((prev) => [...prev, 'iron_champion']);
        }
        return {
          ...m,
          weeklyCount: nextCount,
          hasAttendedToday: true,
        };
      }
      return m;
    });

    setMembers(updatedMembers);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ffffff', '#e2e8f0', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    // Auto cycle background wallpaper for visual achievement
    cycleToNextWallpaper();

    return {
      success: true,
      message: '출석 인증이 성공적으로 기록되었습니다!',
    };
  };

  // Monday 06:00 Automated Settlement Simulation
  const triggerMondaySettlement = () => {
    let newFinesTotal = 0;
    let achieversCount = 0;
    let finedCount = 0;

    const memberResults = members.map((m) => {
      const count = m.weeklyCount;
      const target = squadConfig.weeklyTargetCount;
      const achieved = count >= target;
      let fineAmount = 0;

      if (!achieved) {
        if (count === 3) {
          fineAmount = squadConfig.fine3Times; // e.g. 5,000 KRW
        } else {
          fineAmount = squadConfig.fine2OrLess; // e.g. 10,000 KRW
        }
        finedCount++;
        newFinesTotal += fineAmount;
      } else {
        achieversCount++;
      }

      return {
        userId: m.id,
        userName: m.name,
        count,
        target,
        achieved,
        fineAmount,
      };
    });

    // Apply fines and streak updates
    const updatedMembers = members.map((m) => {
      const res = memberResults.find((r) => r.userId === m.id);
      if (!res) return m;

      return {
        ...m,
        streakWeeks: res.achieved ? m.streakWeeks + 1 : 0,
        unpaidFineAmount: m.unpaidFineAmount + res.fineAmount,
        weeklyCount: 0, // Reset for next week
        hasAttendedToday: false,
      };
    });

    setMembers(updatedMembers);

    const summary: SettlementSummary = {
      weekLabel: '이번 주차 정산 (월요일 06:00)',
      settledAt: new Date().toLocaleString('ko-KR'),
      totalMembers: members.length,
      achieversCount,
      finedCount,
      totalFinesCollected: newFinesTotal,
      memberResults,
    };

    setSettlementSummary(summary);
    setSettlementModalOpen(true);

    if (achieversCount > 0) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Submit fine payment request
  const submitFinePayment = (amount: number, senderName: string) => {
    const updatedMembers = members.map((m) => {
      if (m.id === currentUserId) {
        return {
          ...m,
          pendingPayment: {
            id: `pay_${Date.now()}`,
            amount,
            senderName,
            submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            status: 'pending' as const,
          },
        };
      }
      return m;
    });

    setMembers(updatedMembers);
  };

  // Admin approves fine payment
  const approveFinePayment = (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember || !targetMember.pendingPayment) return;

    const paymentAmount = targetMember.pendingPayment.amount;

    const updatedMembers = members.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          unpaidFineAmount: Math.max(0, m.unpaidFineAmount - paymentAmount),
          pendingPayment: undefined,
        };
      }
      return m;
    });

    setMembers(updatedMembers);
    setSquadConfig((prev) => ({
      ...prev,
      totalFinePool: prev.totalFinePool + paymentAmount,
    }));
  };

  // Update squad config
  const updateSquadConfig = (updates: Partial<SquadConfig>) => {
    setSquadConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset to initial demo state
  const resetDemoData = () => {
    setMembers(INITIAL_MEMBERS);
    setSquadConfig(INITIAL_SQUAD_CONFIG);
    setAttendanceLogs(INITIAL_ATTENDANCE_LOGS);
    setSettlementSummary(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUserId,
        currentUser,
        members,
        squadConfig,
        attendanceLogs,
        activeWallpaperId,
        overlayOpacity,
        activeTab,
        settlementSummary,
        isSettlementModalOpen,
        unlockedWallpapers,
        setActiveTab,
        switchUser,
        verifyWorkout,
        triggerMondaySettlement,
        submitFinePayment,
        approveFinePayment,
        updateSquadConfig,
        selectWallpaper,
        setOverlayOpacity,
        setSettlementModalOpen,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
