import React, { useMemo, useState } from 'react';
import { Home, BarChart3, Smile, Folder, Settings } from 'lucide-react';
import {
  NavTab,
  SourceOption,
  PeriodOption,
  KeywordOption,
  PopularTopicKey,
  INITIAL_NOTIFICATIONS,
  NotificationItem,
  TOPIC_TO_KEYWORD,
  KEYWORD_TO_TOPIC,
  getDashboardSnapshot,
  formatIndonesianPercent,
} from './data/sentimentData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TopFilterDropdowns, QuickPeriodPills } from './components/FilterControls';
import {
  SentimentMetricCards,
  SentimentDonutCard,
  SentimentTrendChart,
} from './components/SentimentCharts';
import {
  InsightBanner,
  TopicTrendList,
  PopularTopicPills,
  RecommendationBox,
} from './components/TopicsAndRecommendations';
import {
  AnalyticsView,
  MonitorView,
  ReportsView,
  SettingsView,
} from './components/SecondaryViews';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronized global filter states
  const [source, setSource] = useState<SourceOption>('Instagram');
  const [period, setPeriod] = useState<PeriodOption>('7 Hari terakhir');
  const [keyword, setKeyword] = useState<KeywordOption>('Isu Pendidikan');
  const [customRange, setCustomRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '2026-01-01',
    endDate: '2026-01-07',
  });
  const [highlightedTopic, setHighlightedTopic] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const activePopularTopic: PopularTopicKey = KEYWORD_TO_TOPIC[keyword];

  const snapshot = useMemo(
    () => getDashboardSnapshot(source, period, keyword, customRange),
    [source, period, keyword, customRange]
  );

  const handleToggleCompactMode = () => {
    setIsCompactMode((prev) => {
      const next = !prev;
      // Align default source to aggregate ("Semua Sumber" -> 70,3% / 18,6% / 11,2%)
      // in Tampilan Ringkas (Beranda 2 & 3) and Instagram (72,5% / 17,3% / 10,2%) in Desktop (Beranda)
      if (next && source === 'Instagram') {
        setSource('Semua Sumber');
      } else if (!next && source === 'Semua Sumber') {
        setSource('Instagram');
      }
      return next;
    });
  };

  const handleSelectPopularTopic = (topic: PopularTopicKey) => {
    const mappedKeyword = TOPIC_TO_KEYWORD[topic];
    setKeyword(mappedKeyword);
    setHighlightedTopic(null);
  };

  const handleSelectTopicTrendName = (topicName: string) => {
    setHighlightedTopic((prev) => (prev === topicName ? null : topicName));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleResetFilters = () => {
    setSource(isCompactMode ? 'Semua Sumber' : 'Instagram');
    setPeriod('7 Hari terakhir');
    setKeyword('Isu Pendidikan');
    setHighlightedTopic(null);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Metrik', 'Nilai', 'Perubahan'],
      ['Sumber', source, '-'],
      ['Periode', period, '-'],
      ['Kata Kunci', keyword, '-'],
      ['Sentimen Positif', formatIndonesianPercent(snapshot.positif.value), `${snapshot.positif.delta}%`],
      ['Sentimen Negatif', formatIndonesianPercent(snapshot.negatif.value), `${snapshot.negatif.delta}%`],
      ['Sentimen Netral', formatIndonesianPercent(snapshot.netral.value), `${snapshot.netral.delta}%`],
      [],
      ['Tanggal/Label', 'Positif', 'Negatif', 'Netral'],
      ...snapshot.trendSeries.map((pt) => [pt.label, String(pt.positif), String(pt.negatif), String(pt.netral)]),
    ];

    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentimen-publik-${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderBerandaDesktop = () => (
    <div className="space-y-6">
      {/* Row 1: Global Filter Dropdowns (Gaya Beranda.png) */}
      <TopFilterDropdowns
        source={source}
        period={period}
        keyword={keyword}
        onChangeSource={setSource}
        onChangePeriod={setPeriod}
        onChangeKeyword={(k) => {
          setKeyword(k);
          setHighlightedTopic(null);
        }}
      />

      {/* Row 2: Greeting + Quick Period Pills */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold leading-tight tracking-tight text-[#0F172A]">
            Halo, User!<span className="ml-1.5" aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-[15px] sm:text-[16px] font-medium text-slate-600">
            Pantau persepsi publik secara real-time.
          </p>
        </div>

        <QuickPeriodPills
          period={period}
          customRange={customRange}
          onSelectPeriod={setPeriod}
          onChangeCustomRange={setCustomRange}
        />
      </div>

      {/* Row 3: 3 Sentiment Metric Cards (Gaya Beranda.png) */}
      <SentimentMetricCards
        snapshot={snapshot}
        onCardClick={() => setActiveTab('monitor')}
      />

      {/* Row 4: Insight Banner (Gaya Beranda 2 & 3) */}
      <InsightBanner text={snapshot.insightText} positive={snapshot.insightPositive} />

      {/* Row 5: Tren Sentimen Line Chart + Donut Breakdown */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-stretch">
        <div className="xl:col-span-7">
          <SentimentTrendChart snapshot={snapshot} />
        </div>
        <div className="xl:col-span-5 flex flex-col justify-center">
          <SentimentDonutCard snapshot={snapshot} />
        </div>
      </div>

      {/* Row 6: Tren Topik & Topik Populer + Rekomendasi Tindak Lanjut */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        <div className="xl:col-span-6 space-y-5">
          <TopicTrendList
            topics={snapshot.topicTrends}
            highlightedTopic={highlightedTopic}
            onSelectTopicName={handleSelectTopicTrendName}
          />
          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6">
            <PopularTopicPills
              activeTopic={activePopularTopic}
              onSelectTopic={handleSelectPopularTopic}
            />
          </div>
        </div>

        <div className="xl:col-span-6 space-y-5">
          <RecommendationBox recommendations={snapshot.recommendations} />

          {/* Summary Quick Snapshot */}
          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-500">Volume Diskusi Terpantau</p>
                <p className="mt-1 text-2xl font-extrabold text-[#0F172A] tabular-nums">
                  {snapshot.totalMentions.toLocaleString('id-ID')} sebutan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('analitik')}
                className="rounded-full bg-[#3B0A6D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4F128E] transition-colors whitespace-nowrap"
              >
                Lihat Analitik Kanal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBerandaCompact = () => (
    <div className="mx-auto w-full max-w-[460px] rounded-[32px] border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-6">
      {/* Greeting (Gaya Beranda 2 & 3) */}
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#0F172A]">
          Halo, User! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-[14px] font-medium text-slate-600">
          Yuk, lihat bagaimana sentimen publik hari ini!
        </p>
      </div>

      {/* 4 Purple Quick Period Pills */}
      <QuickPeriodPills
        period={period}
        customRange={customRange}
        onSelectPeriod={setPeriod}
        onChangeCustomRange={setCustomRange}
        centered
      />

      {/* Donut Chart + Right Legend */}
      <SentimentDonutCard snapshot={snapshot} compact />

      {/* Cream Insight Banner */}
      <InsightBanner text={snapshot.insightText} positive={snapshot.insightPositive} />

      {/* Tren Sentimen Line Chart */}
      <SentimentTrendChart snapshot={snapshot} compact />

      {/* Topik Populer Pills */}
      <PopularTopicPills
        activeTopic={activePopularTopic}
        onSelectTopic={handleSelectPopularTopic}
        centered
      />

      {/* Compact Metric Cards & Recommendations below fold */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <TopicTrendList
          topics={snapshot.topicTrends}
          highlightedTopic={highlightedTopic}
          onSelectTopicName={handleSelectTopicTrendName}
        />
        <RecommendationBox recommendations={snapshot.recommendations} />
      </div>
    </div>
  );

  const mobileBottomNavItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'analitik', label: 'Analitik', icon: BarChart3 },
    { id: 'monitor', label: 'Monitor', icon: Smile },
    { id: 'laporan', label: 'Laporan', icon: Folder },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-[#0F172A]">
      {/* Left Sidebar hidden when Tampilan Ringkas is active */}
      {!isCompactMode && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Shell */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          activeTab={activeTab}
          isCompactMode={isCompactMode}
          onToggleCompactMode={handleToggleCompactMode}
          onSelectTab={setActiveTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onExportSummary={handleExportCsv}
          onResetFilters={handleResetFilters}
        />

        <main className="mx-auto w-full max-w-[1220px] flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
          {activeTab === 'beranda' &&
            (isCompactMode ? renderBerandaCompact() : renderBerandaDesktop())}

          {activeTab === 'analitik' && (
            <AnalyticsView
              snapshot={snapshot}
              source={source}
              period={period}
              keyword={keyword}
              onExportCsv={handleExportCsv}
              isCompactMode={isCompactMode}
              onToggleCompactMode={handleToggleCompactMode}
            />
          )}

          {activeTab === 'monitor' && (
            <MonitorView
              snapshot={snapshot}
              source={source}
              period={period}
              keyword={keyword}
              onExportCsv={handleExportCsv}
              isCompactMode={isCompactMode}
              onToggleCompactMode={handleToggleCompactMode}
            />
          )}

          {activeTab === 'laporan' && (
            <ReportsView
              snapshot={snapshot}
              source={source}
              period={period}
              keyword={keyword}
              onExportCsv={handleExportCsv}
              isCompactMode={isCompactMode}
              onToggleCompactMode={handleToggleCompactMode}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              snapshot={snapshot}
              source={source}
              period={period}
              keyword={keyword}
              onExportCsv={handleExportCsv}
              isCompactMode={isCompactMode}
              onToggleCompactMode={handleToggleCompactMode}
            />
          )}
        </main>
      </div>

      {/* Mobile / Compact Bottom Navigation Bar (compact height <= 64px) */}
      <nav
        aria-label="Navigasi Cepat Bawah"
        className={`fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-sm ${
          isCompactMode ? 'flex' : 'flex lg:hidden'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[520px] items-center justify-around px-1 py-1.5">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#3B0A6D] bg-violet-50'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
