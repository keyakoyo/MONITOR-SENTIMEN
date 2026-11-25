import React from 'react';
import { Home, BarChart3, Smile, Folder, Settings, X } from 'lucide-react';
import { NavTab } from '../data/sentimentData';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'analitik', label: 'Analitik', icon: BarChart3 },
  { id: 'monitor', label: 'Monitor Sentimen', icon: Smile },
  { id: 'laporan', label: 'Laporan', icon: Folder },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <div className="flex h-full w-[232px] flex-col bg-[#3B0A6D] px-4 py-7 text-white select-none">
      {/* Top Surveillance / Monitoring Camera Icon */}
      <div className="mb-9 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => {
            onSelectTab('beranda');
            onCloseMobile?.();
          }}
          className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl p-1"
          aria-label="Sentimen Publik Beranda"
        >
          {/* Crisp white CCTV / monitoring camera with bottom-left mounting arm */}
          <svg
            viewBox="0 0 64 56"
            className="h-12 w-14 shrink-0 text-white transition-transform duration-200 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Camera body tilted down-right */}
            <g transform="rotate(20 32 24)">
              <rect x="12" y="12" width="34" height="18" rx="4" fill="currentColor" />
              <path d="M46 15L55 12V30L46 27V15Z" fill="currentColor" />
              <circle cx="21" cy="21" r="2.5" fill="#3B0A6D" />
            </g>
            {/* Mounting arm & base at bottom-left */}
            <path
              d="M25 29L18 40H9V47"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="5" y="46" width="10" height="4" rx="2" fill="currentColor" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight text-white">Sentimen</span>
            <span className="text-[13px] font-medium text-white/80">Publik</span>
          </div>
        </button>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Vertical Navigation */}
      <nav className="flex flex-1 flex-col gap-2" aria-label="Navigasi Utama">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile?.();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3.5 rounded-full px-4 py-3 text-left text-[15px] font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                isActive
                  ? 'bg-[#6D4696] text-white font-semibold shadow-sm'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 text-white" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle footer note inside sidebar */}
      <div className="mt-auto border-t border-white/15 px-3 pt-4 text-xs text-white/70">
        <p className="font-medium text-white/90">Pemantauan Persepsi</p>
        <p className="mt-0.5 text-[11px] text-white/65">Data sinkron lintas kanal</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full shadow-2xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
