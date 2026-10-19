import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { SquadTab } from './components/SquadTab';
import { VerifyTab } from './components/VerifyTab';
import { FinesTab } from './components/FinesTab';
import { RulesTab } from './components/RulesTab';
import { MondaySettlementModal } from './components/MondaySettlementModal';
import { WALLPAPERS } from './data/wallpapers';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    activeWallpaperId,
    overlayOpacity,
    isSettlementModalOpen,
    setSettlementModalOpen,
  } = useApp();

  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === activeWallpaperId) || WALLPAPERS[0];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Wallpaper with dynamic dimming overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={currentWallpaper.imagePath}
          alt="IRON CODE Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
        />
        {/* Dynamic Dark Scrim Overlay */}
        <div
          className="absolute inset-0 bg-slate-950 transition-opacity duration-300"
          style={{ opacity: overlayOpacity / 100 }}
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none" />
      </div>

      {/* App Shell Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-4 pb-20">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'squad' && <SquadTab />}
          {activeTab === 'verify' && <VerifyTab />}
          {activeTab === 'fines' && <FinesTab />}
          {activeTab === 'rules' && <RulesTab />}
        </main>

        <BottomNav />
      </div>

      {/* Monday 06:00 Settlement Summary Modal */}
      {isSettlementModalOpen && (
        <MondaySettlementModal onClose={() => setSettlementModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
