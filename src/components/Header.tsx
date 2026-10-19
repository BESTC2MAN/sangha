import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Play, Dumbbell } from 'lucide-react';
import { WallpaperSelectorModal } from './WallpaperSelectorModal';
import { UserSwitcherModal } from './UserSwitcherModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    squadConfig,
    triggerMondaySettlement,
  } = useApp();

  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-slate-950/40 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_0_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand Wordmark with MORE STRONG PEOPLE (no spans) */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h1 className="font-['Oswald'] text-xl font-bold tracking-wider text-slate-100 whitespace-nowrap">
              MORE STRONG PEOPLE
            </h1>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {/* Wallpaper picker trigger */}
            <button
              onClick={() => setIsWallpaperOpen(true)}
              title="배경화면 테마 및 투명도 변경"
              className="p-2 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 rounded-xl transition-all flex items-center gap-1 text-xs shadow-md"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-medium text-slate-300">배경</span>
            </button>

            {/* Persona Switcher */}
            <button
              onClick={() => setIsUserSwitcherOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 rounded-xl transition-all text-xs shadow-md"
              title="멤버 전환 (테스트용)"
            >
              <div
                className={`w-5 h-5 rounded-full ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-[10px]`}
              >
                {currentUser.avatarInitials}
              </div>
              <span className="text-slate-200 font-medium truncate max-w-[80px]">
                {currentUser.name}
              </span>
            </button>

            {/* Monday 06:00 settlement trigger button */}
            <button
              onClick={triggerMondaySettlement}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title="월요일 06:00 주간 벌금 정산 시뮬레이션"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">월 06:00 정산</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      {isWallpaperOpen && <WallpaperSelectorModal onClose={() => setIsWallpaperOpen(false)} />}
      {isUserSwitcherOpen && <UserSwitcherModal onClose={() => setIsUserSwitcherOpen(false)} />}
    </>
  );
};
