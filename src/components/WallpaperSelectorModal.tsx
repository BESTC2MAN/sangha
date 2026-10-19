import React from 'react';
import { useApp } from '../context/AppContext';
import { WALLPAPERS } from '../data/wallpapers';
import { Check, Lock, Sparkles, X, Sliders } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const WallpaperSelectorModal: React.FC<Props> = ({ onClose }) => {
  const {
    activeWallpaperId,
    selectWallpaper,
    unlockedWallpapers,
    overlayOpacity,
    setOverlayOpacity,
  } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/80 backdrop-blur-2xl border border-white/10 w-full max-w-md p-5 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/80 border border-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            ATMOSPHERE & THEME
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">배경화면 & 동기부여 설정</h3>
          <p className="text-xs text-slate-400 mt-1">
            운동 완료 시 배경화면이 자동으로 순환하며, 주간 목표(4회) 달성 시 특별 챔피언 테마가 해금됩니다.
          </p>
        </div>

        {/* Wallpaper grid */}
        <div className="grid grid-cols-2 gap-3">
          {WALLPAPERS.map((wp) => {
            const isUnlocked = unlockedWallpapers.includes(wp.id);
            const isSelected = activeWallpaperId === wp.id;

            return (
              <div
                key={wp.id}
                onClick={() => {
                  if (isUnlocked) selectWallpaper(wp.id);
                }}
                className={`relative rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-400 scale-[1.02]'
                    : isUnlocked
                    ? 'border-slate-800 hover:border-slate-600'
                    : 'border-slate-850 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="aspect-[9/14] w-full bg-slate-950 relative overflow-hidden">
                  <img
                    src={wp.imagePath}
                    alt={wp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-2 right-2">
                    {isSelected && (
                      <span className="p-1 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="p-1 rounded-full bg-slate-900/90 text-slate-400 border border-slate-700 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[10px] text-amber-400 font-semibold block uppercase">
                      {wp.theme}
                    </span>
                    <span className="text-xs font-bold text-slate-100 block truncate">
                      {wp.title}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[9px] text-rose-300 block mt-0.5">
                        {wp.unlockCondition}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overlay Opacity Slider */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              배경 어두움 농도 조절 (가독성)
            </span>
            <span className="font-mono text-amber-400 font-bold tabular-nums">
              {overlayOpacity}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="95"
            step="5"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};
