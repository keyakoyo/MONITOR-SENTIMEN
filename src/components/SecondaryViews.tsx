import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Search,
  Flag,
  Download,
  FileText,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DashboardSnapshot,
  SourceOption,
  PeriodOption,
  KeywordOption,
  formatIndonesianPercent,
} from '../data/sentimentData';

interface SecondaryViewProps {
  snapshot: DashboardSnapshot;
  source: SourceOption;
  period: PeriodOption;
  keyword: KeywordOption;
  onExportCsv: () => void;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
}

export const AnalyticsView: React.FC<SecondaryViewProps> = ({
  snapshot,
  period,
  keyword,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
          Analitik Lintas Kanal
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Perbandingan distribusi sentimen untuk <span className="font-semibold text-slate-900">{keyword}</span> pada periode <span className="font-semibold text-slate-900">{period}</span>.
        </p>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Total Sebutan Publik</p>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A] tabular-nums">
            {snapshot.totalMentions.toLocaleString('id-ID')}
          </p>
          <p className="mt-1 text-xs text-slate-600">Terverifikasi dari 5 kanal aktif</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Dominasi Positif</p>
          <p className="mt-2 text-3xl font-extrabold text-[#15803D] tabular-nums">
            {formatIndonesianPercent(snapshot.positif.value)}
          </p>
          <p className="mt-1 text-xs text-slate-600">Rata-rata skor persepsi baik</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500">Topik Teratas</p>
          <p className="mt-2 truncate text-xl font-extrabold text-[#3B0A6D]">
            {snapshot.topicTrends[0]?.name}
          </p>
          <p className="mt-1 text-xs text-slate-600 tabular-nums">
            Porsi diskusi {snapshot.topicTrends[0]?.percentage}%
          </p>
        </div>
      </div>

      {/* Grouped Bar Chart per Source */}
      <div className="rounded-[26px] border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#0F172A]">Perbandingan Sentimen per Sumber (%)</h2>
        <div className="mt-4 h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={snapshot.sourceBreakdowns}
              margin={{ top: 10, right: 12, left: -16, bottom: 4 }}
            >
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="source"
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <RechartsTooltip
                formatter={(val: unknown, name: unknown) => [`${val}%`, String(name)]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="positif" name="Positif" fill="#8CE96A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="negatif" name="Negatif" fill="#FF9999" radius={[6, 6, 0, 0]} />
              <Bar dataKey="netral" name="Netral" fill="#B2C2FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabular Breakdown Table */}
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-bold text-[#0F172A]">Rincian Metrik Tiap Sumber</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-6 py-3">Sumber Media</th>
                <th className="px-6 py-3 text-right">Volume</th>
                <th className="px-6 py-3 text-right">Positif</th>
                <th className="px-6 py-3 text-right">Negatif</th>
                <th className="px-6 py-3 text-right">Netral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {snapshot.sourceBreakdowns.map((row) => (
                <tr key={row.source} className="hover:bg-slate-50/70">
                  <td className="px-6 py-3.5 font-semibold text-slate-900">{row.source}</td>
                  <td className="px-6 py-3.5 text-right text-slate-700 tabular-nums">
                    {row.volume.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-emerald-700 tabular-nums">
                    {formatIndonesianPercent(row.positif)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-rose-700 tabular-nums">
                    {formatIndonesianPercent(row.negatif)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-indigo-700 tabular-nums">
                    {formatIndonesianPercent(row.netral)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const MonitorView: React.FC<SecondaryViewProps> = ({ snapshot, source, keyword }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'Semua' | 'Positif' | 'Negatif' | 'Netral'>('Semua');
  const [flaggedIds, setFlaggedIds] = useState<Record<string, boolean>>({});

  const visibleMentions = snapshot.mentions.filter((item) => {
    const matchSentiment = sentimentFilter === 'Semua' || item.sentiment === sentimentFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      item.excerpt.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q);
    return matchSentiment && matchQuery;
  });

  const toggleFlag = (id: string) => {
    setFlaggedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
          Monitor Sentimen Publik
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Aliran opini publik terbaru untuk <span className="font-semibold text-slate-900">{source}</span> · <span className="font-semibold text-slate-900">{keyword}</span>
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari isi komentar atau akun..."
            className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0A6D] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-slate-200/70 p-1">
          {(['Semua', 'Positif', 'Negatif', 'Netral'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSentimentFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                sentimentFilter === tab
                  ? 'bg-[#3B0A6D] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Mentions List */}
      {visibleMentions.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-bold text-slate-900">Tidak ada sebutan yang cocok</p>
          <p className="mt-1 text-sm text-slate-500">
            Coba ubah kata kunci pencarian atau pilih kategori sentimen lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSentimentFilter('Semua');
            }}
            className="mt-4 rounded-full bg-[#3B0A6D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#4F128E]"
          >
            Tampilkan Semua
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleMentions.map((m) => {
            const isFlagged = Boolean(flaggedIds[m.id]);
            const sentimentBadgeClass =
              m.sentiment === 'Positif'
                ? 'bg-[#C2EEB3] text-[#0F172A]'
                : m.sentiment === 'Negatif'
                ? 'bg-[#FF9E9E] text-[#0F172A]'
                : 'bg-[#B2C2FF] text-[#0F172A]';

            return (
              <div
                key={m.id}
                className="flex flex-col justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-5 sm:flex-row sm:items-start"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="text-sm font-bold text-slate-900">{m.author}</span>
                    <span>{m.handle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{m.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-800">{m.excerpt}</p>
                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 tabular-nums">
                    <span>Topik: {m.keyword}</span>
                    <span>Interaksi: {m.engagement.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-bold ${sentimentBadgeClass}`}
                  >
                    {m.sentiment}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFlag(m.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isFlagged
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-pressed={isFlagged}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>{isFlagged ? 'Ditandai' : 'Tandai'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ReportsView: React.FC<SecondaryViewProps> = ({
  snapshot,
  source,
  period,
  keyword,
  onExportCsv,
}) => {
  const [downloadedNote, setDownloadedNote] = useState(false);

  const handleDownload = () => {
    onExportCsv();
    setDownloadedNote(true);
    setTimeout(() => setDownloadedNote(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Laporan Persepsi Publik
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ringkasan siap unduh sesuai filter aktif: {source} · {period} · {keyword}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B0A6D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F128E] whitespace-nowrap shrink-0"
        >
          {downloadedNote ? (
            <>
              <Check className="h-4 w-4" />
              <span>CSV Diunduh</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Unduh Laporan CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Executive Summary Preview Card */}
      <div className="rounded-[26px] border border-slate-200 bg-white p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-[#3B0A6D]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Ringkasan Eksekutif</h2>
            <p className="text-xs text-slate-500">
              Total {snapshot.totalMentions.toLocaleString('id-ID')} percakapan dianalisis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#C2EEB3]/60 p-4">
            <p className="text-xs font-semibold text-slate-700">Sentimen Positif</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatIndonesianPercent(snapshot.positif.value)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FF9E9E]/60 p-4">
            <p className="text-xs font-semibold text-slate-700">Sentimen Negatif</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatIndonesianPercent(snapshot.negatif.value)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#B2C2FF]/60 p-4">
            <p className="text-xs font-semibold text-slate-700">Sentimen Netral</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatIndonesianPercent(snapshot.netral.value)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">Rekomendasi Tindak Lanjut</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
            {snapshot.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC<SecondaryViewProps> = ({
  isCompactMode,
  onToggleCompactMode,
}) => {
  const [alertThreshold, setAlertThreshold] = useState(25);
  const [autoDigest, setAutoDigest] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
          Pengaturan Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sesuaikan mode tampilan, ambang peringatan lonjakan sentimen negatif, dan preferensi ringkasan.
        </p>
      </div>

      <div className="rounded-[26px] border border-slate-200 bg-white p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="text-sm font-bold text-slate-900">Mode Tampilan Dashboard</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Beralih antara tampilan desktop lengkap dan tampilan ringkas mobile-first.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleCompactMode}
            className="inline-flex items-center gap-2 rounded-full bg-[#A78BFA] px-4 py-2 text-xs font-bold text-[#1E1B4B] hover:bg-[#9575FA] whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{isCompactMode ? 'Aktif: Tampilan Ringkas' : 'Aktif: Desktop Lengkap'}</span>
          </button>
        </div>

        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <label htmlFor="threshold-slider" className="text-sm font-bold text-slate-900">
              Ambang Peringatan Sentimen Negatif
            </label>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 tabular-nums">
              {alertThreshold}%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Kirim notifikasi jika persentase sentimen negatif melampaui batas ini.
          </p>
          <input
            id="threshold-slider"
            type="range"
            min={10}
            max={50}
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="mt-3 w-full accent-[#3B0A6D]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Ringkasan Harian Otomatis</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Buat laporan harian otomatis setiap pukul 08:00 WIB.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoDigest}
            onClick={() => setAutoDigest((prev) => !prev)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              autoDigest ? 'bg-[#3B0A6D]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                autoDigest ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#3B0A6D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4F128E] transition-colors"
          >
            Simpan Pengaturan
          </button>
          {savedNotice && (
            <span className="text-xs font-semibold text-emerald-700">
              Pengaturan berhasil disimpan.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
