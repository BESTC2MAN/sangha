export type VerificationType = 'gps' | 'photo' | 'run';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  type: VerificationType;
  gymName?: string;
  distanceToGymMeters?: number;
  photoUrl?: string;
  runDistanceKm?: number;
  runDurationMinutes?: number;
  runPace?: string;
  note?: string;
  verified: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: 'leader' | 'member';
  avatarInitials: string;
  avatarBg: string;
  weeklyCount: number;
  streakWeeks: number;
  hasAttendedToday: boolean;
  unpaidFineAmount: number;
  pendingPayment?: {
    id: string;
    amount: number;
    senderName: string;
    submittedAt: string;
    status: 'pending' | 'approved';
  };
}

export interface SquadConfig {
  name: string;
  gymName: string;
  gymAddress: string;
  gymLat: number;
  gymLng: number;
  targetRadiusMeters: number; // e.g. 1000m
  weeklyTargetCount: number; // 4
  fine3Times: number; // 5000 KRW
  fine2OrLess: number; // 10000 KRW
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  inviteCode: string;
  totalFinePool: number;
  announcement: string;
  exceptionPolicy: string;
  ruleSchedule: string;
  ruleVerification: string;
  ruleFinesNote: string;
}

export interface SettlementSummary {
  weekLabel: string;
  settledAt: string;
  totalMembers: number;
  achieversCount: number;
  finedCount: number;
  totalFinesCollected: number;
  memberResults: {
    userId: string;
    userName: string;
    count: number;
    target: number;
    achieved: boolean;
    fineAmount: number;
  }[];
}

export interface WallpaperItem {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  imagePath: string;
  unlockedByDefault: boolean;
  unlockCondition?: string;
}
