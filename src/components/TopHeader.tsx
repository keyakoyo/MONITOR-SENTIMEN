import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Settings,
  Menu,
  Smartphone,
  Monitor,
  CheckCheck,
  User,
  Download,
  RotateCcw,
} from 'lucide-react';
import { NavTab, NotificationItem } from '../data/sentimentData';

interface TopHeaderProps {
  activeTab: NavTab;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onExportSummary: () => void;
  onResetFilters: () => void;
}

const TAB_LABELS: Record<NavTab, string> = {
  beranda: 'Beranda',
  analitik: 'Analitik',
  monitor: 'Monitor Sentimen',
  laporan: 'Laporan',
  pengaturan: 'Pengaturan',
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  isCompactMode,
  onToggleCompactMode,
  onSelectTab,
  onOpenMobileMenu,
  notifications,
  onMarkAllRead,
  onExportSummary,
  onResetFilters,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Left Zone: Gear Icon in Compact/Mobile Mode + Breadcrumb / Menu trigger */}
      <div className="flex items-center gap-3 min-w-0">
        {!isCompactMode && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D]"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Gear icon shown prominently in compact/mobile mode (Gaya Beranda 2 & 3) */}
        <button
          type="button"
          onClick={() => onSelectTab('pengaturan')}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D] ${
            isCompactMode ? 'flex' : 'flex lg:hidden'
          }`}
          aria-label="Buka Pengaturan"
          title="Pengaturan"
        >
          <Settings className="h-5 w-5 stroke-[2]" />
        </button>

        {!isCompactMode && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">Sentimen Publik</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-600">{TAB_LABELS[activeTab]}</span>
          </div>
        )}
      </div>

      {/* Right Zone: Compact Mode Toggle + Notification Bell + Circular Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        <button
          type="button"
          onClick={onToggleCompactMode}
          className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D] ${
            isCompactMode
              ? 'border-[#3B0A6D] bg-[#3B0A6D] text-white hover:bg-[#4C1388]'
              : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
          aria-pressed={isCompactMode}
        >
          {isCompactMode ? (
            <>
              <Monitor className="h-3.5 w-3.5" />
              <span>Tampilan Desktop</span>
            </>
          ) : (
            <>
              <Smartphone className="h-3.5 w-3.5" />
              <span>Tampilan Ringkas</span>
            </>
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D]"
            aria-label="Notifikasi sentimen"
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-bold text-slate-900">Notifikasi ({unreadCount})</span>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B21B6] hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tandai dibaca
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl px-2.5 py-2.5 transition-colors ${
                      item.unread ? 'bg-violet-50/60' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                      <span className="shrink-0 text-[11px] text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D]"
            aria-label="Menu profil pengguna"
            aria-expanded={profileOpen}
          >
            {!avatarError ? (
              <img
                src="/src/assets/images/avatar_user_profile_1795591970188.jpg"
                alt="Foto Profil User"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#3B0A6D] text-xs font-bold text-white">
                US
              </span>
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-sm font-bold text-slate-900">User Analis</p>
                <p className="text-xs text-slate-500">Tim Pemantauan Persepsi Publik</p>
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('pengaturan');
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  Preferensi Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportSummary();
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                  Ekspor Ringkasan CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                >
                  <RotateCcw className="h-4 w-4 text-rose-600" />
                  Reset Semua Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
