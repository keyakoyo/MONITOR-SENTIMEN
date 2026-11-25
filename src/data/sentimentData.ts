export type SourceOption =
  | 'Instagram'
  | 'X / Twitter'
  | 'TikTok'
  | 'Portal Berita'
  | 'YouTube'
  | 'Semua Sumber';

export type PeriodOption =
  | '7 Hari terakhir'
  | 'Hari ini'
  | '30 Hari terakhir'
  | 'Custom';

export type KeywordOption =
  | 'Isu Pendidikan'
  | 'Isu Lingkungan'
  | 'Isu Ekonomi'
  | 'Layanan Publik'
  | 'Semua Kata Kunci';

export type PopularTopicKey =
  | 'Pendidikan'
  | 'Lingkungan'
  | 'Ekonomi'
  | 'Layanan Publik'
  | 'Kesehatan';

export type NavTab =
  | 'beranda'
  | 'analitik'
  | 'monitor'
  | 'laporan'
  | 'pengaturan';

export interface SentimentMetricItem {
  value: number;
  delta: number;
  arrow: 'up' | 'down';
}

export interface TrendPoint {
  label: string;
  positif: number;
  negatif: number;
  netral: number;
}

export interface TopicTrendItem {
  rank: number;
  name: string;
  percentage: number;
  purpleShare: number; // left portion in % of bar
  category: PopularTopicKey;
}

export interface PublicMention {
  id: string;
  author: string;
  handle: string;
  source: Exclude<SourceOption, 'Semua Sumber'>;
  keyword: Exclude<KeywordOption, 'Semua Kata Kunci'>;
  sentiment: 'Positif' | 'Negatif' | 'Netral';
  timestamp: string;
  excerpt: string;
  engagement: number;
  flagged?: boolean;
}

export interface SourceBreakdown {
  source: Exclude<SourceOption, 'Semua Sumber'>;
  positif: number;
  negatif: number;
  netral: number;
  volume: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  tone: 'positive' | 'warning' | 'neutral';
}

export interface DashboardSnapshot {
  positif: SentimentMetricItem;
  negatif: SentimentMetricItem;
  netral: SentimentMetricItem;
  insightText: string;
  insightPositive: boolean;
  trendSeries: TrendPoint[];
  topicTrends: TopicTrendItem[];
  recommendations: string[];
  totalMentions: number;
  sourceBreakdowns: SourceBreakdown[];
  mentions: PublicMention[];
}

export const SOURCE_OPTIONS: SourceOption[] = [
  'Instagram',
  'X / Twitter',
  'TikTok',
  'Portal Berita',
  'YouTube',
  'Semua Sumber',
];

export const PERIOD_OPTIONS: PeriodOption[] = [
  '7 Hari terakhir',
  'Hari ini',
  '30 Hari terakhir',
  'Custom',
];

export const KEYWORD_OPTIONS: KeywordOption[] = [
  'Isu Pendidikan',
  'Isu Lingkungan',
  'Isu Ekonomi',
  'Layanan Publik',
  'Semua Kata Kunci',
];

export const TOPIC_TO_KEYWORD: Record<PopularTopicKey, KeywordOption> = {
  Pendidikan: 'Isu Pendidikan',
  Lingkungan: 'Isu Lingkungan',
  Ekonomi: 'Isu Ekonomi',
  'Layanan Publik': 'Layanan Publik',
  Kesehatan: 'Semua Kata Kunci',
};

export const KEYWORD_TO_TOPIC: Record<KeywordOption, PopularTopicKey> = {
  'Isu Pendidikan': 'Pendidikan',
  'Isu Lingkungan': 'Lingkungan',
  'Isu Ekonomi': 'Ekonomi',
  'Layanan Publik': 'Layanan Publik',
  'Semua Kata Kunci': 'Pendidikan',
};

export function formatIndonesianPercent(val: number, decimals = 1): string {
  return `${val.toFixed(decimals).replace('.', ',')}%`;
}

export function formatDotPercent(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

export function formatSignedDelta(delta: number): string {
  const absFormatted = Math.abs(delta).toFixed(1).replace('.', ',');
  return delta >= 0 ? `+ ${absFormatted}%` : `- ${absFormatted}%`;
}

// Base topic profiles per keyword
const KEYWORD_BASE: Record<
  KeywordOption,
  {
    positif: number;
    negatif: number;
    netral: number;
    deltaPos: number;
    deltaNeg: number;
    deltaNeu: number;
    topics: TopicTrendItem[];
    recommendations: string[];
    insightUp: string;
    insightDown: string;
  }
> = {
  'Isu Pendidikan': {
    positif: 72.5,
    negatif: 17.3,
    netral: 10.2,
    deltaPos: 2.1,
    deltaNeg: -0.8,
    deltaNeu: -1.3,
    topics: [
      { rank: 1, name: 'Biaya Pendidikan', percentage: 83, purpleShare: 58, category: 'Pendidikan' },
      { rank: 2, name: 'Pemerataan Pendidikan', percentage: 68, purpleShare: 62, category: 'Pendidikan' },
      { rank: 3, name: 'Beasiswa', percentage: 43, purpleShare: 54, category: 'Pendidikan' },
    ],
    recommendations: [
      'Pertahankan komunikasi positif terkait program pendidikan',
      'Perhatikan isu biaya pendidikan yang masih menjadi perhatian publik',
    ],
    insightUp: 'Sentimen positif sedang meningkat dibanding kemarin!',
    insightDown: 'Perhatian publik pada biaya pendidikan memerlukan klarifikasi proaktif.',
  },
  'Isu Lingkungan': {
    positif: 64.2,
    negatif: 22.4,
    netral: 13.4,
    deltaPos: 1.6,
    deltaNeg: -1.1,
    deltaNeu: -0.5,
    topics: [
      { rank: 1, name: 'Pengelolaan Sampah Kota', percentage: 79, purpleShare: 52, category: 'Lingkungan' },
      { rank: 2, name: 'Kualitas Udara & Emisi', percentage: 65, purpleShare: 60, category: 'Lingkungan' },
      { rank: 3, name: 'Ruang Terbuka Hijau', percentage: 49, purpleShare: 48, category: 'Lingkungan' },
    ],
    recommendations: [
      'Publikasikan capaian program daur ulang dan ruang terbuka hijau secara berkala',
      'Tanggapi keluhan warga terkait titik penumpukan sampah dan polusi udara dengan data lapangan',
    ],
    insightUp: 'Dukungan publik terhadap inisiatif ruang hijau meningkat minggu ini!',
    insightDown: 'Diskusi negatif seputar kualitas udara perkotaan mengalami lonjakan ringan.',
  },
  'Isu Ekonomi': {
    positif: 58.4,
    negatif: 26.8,
    netral: 14.8,
    deltaPos: -1.4,
    deltaNeg: 1.9,
    deltaNeu: -0.5,
    topics: [
      { rank: 1, name: 'Harga Bahan Pokok', percentage: 86, purpleShare: 64, category: 'Ekonomi' },
      { rank: 2, name: 'Pemberdayaan UMKM', percentage: 71, purpleShare: 55, category: 'Ekonomi' },
      { rank: 3, name: 'Lapangan Kerja Baru', percentage: 52, purpleShare: 50, category: 'Ekonomi' },
    ],
    recommendations: [
      'Perkuat informasi bantuan modal UMKM dan operasi pasar stabilisasi harga pangan',
      'Sediakan kanal pelaporan harga kebutuhan pokok yang responsif di tingkat daerah',
    ],
    insightUp: 'Apresiasi publik terhadap program pembiayaan UMKM terus bertumbuh!',
    insightDown: 'Sentimen negatif terkait kenaikan harga pangan perlu direspons segera.',
  },
  'Layanan Publik': {
    positif: 67.8,
    negatif: 19.5,
    netral: 12.7,
    deltaPos: 2.8,
    deltaNeg: -1.5,
    deltaNeu: -1.3,
    topics: [
      { rank: 1, name: 'Digitalisasi Administrasi', percentage: 81, purpleShare: 56, category: 'Layanan Publik' },
      { rank: 2, name: 'Transportasi Terpadu', percentage: 63, purpleShare: 61, category: 'Layanan Publik' },
      { rank: 3, name: 'Antrean Layanan Kesehatan', percentage: 46, purpleShare: 53, category: 'Layanan Publik' },
    ],
    recommendations: [
      'Pertahankan stabilitas sistem perizinan daring yang mendapat respons positif',
      'Perbaiki waktu tunggu layanan tatap muka serta sosialisasikan panduan antrean digital',
    ],
    insightUp: 'Kepuasan terhadap digitalisasi administrasi publik melonjak signifikan!',
    insightDown: 'Keluhan waktu tunggu layanan kesehatan perlu evaluasi alur antrean.',
  },
  'Semua Kata Kunci': {
    positif: 68.9,
    negatif: 19.2,
    netral: 11.9,
    deltaPos: 1.8,
    deltaNeg: -0.9,
    deltaNeu: -0.9,
    topics: [
      { rank: 1, name: 'Biaya Pendidikan', percentage: 81, purpleShare: 58, category: 'Pendidikan' },
      { rank: 2, name: 'Harga Bahan Pokok', percentage: 74, purpleShare: 60, category: 'Ekonomi' },
      { rank: 3, name: 'Digitalisasi Administrasi', percentage: 59, purpleShare: 52, category: 'Layanan Publik' },
    ],
    recommendations: [
      'Jaga momentum komunikasi program unggulan pendidikan dan layanan publik digital',
      'Prioritaskan mitigasi isu biaya pendidikan dan stabilitas harga pangan di media sosial',
    ],
    insightUp: 'Sentimen positif lintas isu strategis meningkat dibanding hari sebelumnya!',
    insightDown: 'Beberapa isu ekonomi dan biaya hidup memicu diskusi kritis di kanal publik.',
  },
};

const SOURCE_OFFSETS: Record<
  SourceOption,
  { posOffset: number; negOffset: number; volumeMultiplier: number }
> = {
  Instagram: { posOffset: 0, negOffset: 0, volumeMultiplier: 1.0 },
  'X / Twitter': { posOffset: -6.4, negOffset: 5.1, volumeMultiplier: 1.35 },
  TikTok: { posOffset: 2.3, negOffset: -1.4, volumeMultiplier: 1.25 },
  'Portal Berita': { posOffset: -3.2, negOffset: 1.2, volumeMultiplier: 0.78 },
  YouTube: { posOffset: 1.1, negOffset: -0.6, volumeMultiplier: 0.85 },
  'Semua Sumber': { posOffset: -2.2, negOffset: 1.3, volumeMultiplier: 4.8 },
};

const ALL_MENTIONS: PublicMention[] = [
  {
    id: 'm1',
    author: 'Nadia Putri',
    handle: '@nadiaputri.id',
    source: 'Instagram',
    keyword: 'Isu Pendidikan',
    sentiment: 'Positif',
    timestamp: '12 menit lalu',
    excerpt: 'Program beasiswa daerah tahun ini sangat membantu mahasiswa baru untuk melanjutkan kuliah tanpa terbebani biaya awal.',
    engagement: 1420,
  },
  {
    id: 'm2',
    author: 'Rizky Pratama',
    handle: '@rizkypratama_',
    source: 'X / Twitter',
    keyword: 'Isu Pendidikan',
    sentiment: 'Negatif',
    timestamp: '28 menit lalu',
    excerpt: 'Transparansi rincian biaya pendidikan di beberapa sekolah masih perlu diperjelas agar orang tua tidak kebingungan.',
    engagement: 894,
  },
  {
    id: 'm3',
    author: 'Komunitas Hijau Nusantara',
    handle: '@hijaunusantara',
    source: 'Instagram',
    keyword: 'Isu Lingkungan',
    sentiment: 'Positif',
    timestamp: '45 menit lalu',
    excerpt: 'Penambahan taman kota dan jalur sepeda baru di pusat kota mulai terasa manfaatnya di akhir pekan.',
    engagement: 2150,
  },
  {
    id: 'm4',
    author: 'Dika Kurniawan',
    handle: '@dikakurnia',
    source: 'TikTok',
    keyword: 'Isu Pendidikan',
    sentiment: 'Positif',
    timestamp: '1 jam lalu',
    excerpt: 'Pemerataan fasilitas laboratorium sekolah ke wilayah pinggiran patut diapresiasi, siswa jadi lebih semangat praktikum.',
    engagement: 4830,
  },
  {
    id: 'm5',
    author: 'Redaksi Ekonomi Harian',
    handle: '@ekonomiharian',
    source: 'Portal Berita',
    keyword: 'Isu Ekonomi',
    sentiment: 'Netral',
    timestamp: '2 jam lalu',
    excerpt: 'Pelaku UMKM menunggu detail jadwal penyaluran pembiayaan berbunga rendah untuk kuartal mendatang.',
    engagement: 612,
  },
  {
    id: 'm6',
    author: 'Siti Rahmawati',
    handle: '@sitirahma_edu',
    source: 'YouTube',
    keyword: 'Isu Pendidikan',
    sentiment: 'Netral',
    timestamp: '3 jam lalu',
    excerpt: 'Perlu sosialisasi lebih luas terkait batas akhir pendaftaran beasiswa prestasi agar siswa di pelosok tidak tertinggal.',
    engagement: 745,
  },
  {
    id: 'm7',
    author: 'Budi Santoso',
    handle: '@budisantoso_jkt',
    source: 'X / Twitter',
    keyword: 'Layanan Publik',
    sentiment: 'Positif',
    timestamp: '4 jam lalu',
    excerpt: 'Perpanjangan dokumen kependudukan lewat aplikasi sekarang cuma 15 menit selesai, tidak perlu antre lama lagi.',
    engagement: 1680,
  },
  {
    id: 'm8',
    author: 'Larasati Dewi',
    handle: '@larasdewi',
    source: 'TikTok',
    keyword: 'Isu Ekonomi',
    sentiment: 'Negatif',
    timestamp: '5 jam lalu',
    excerpt: 'Harga beras dan minyak goreng di pasar tradisional minggu ini terasa naik lagi, semoga operasi pasar diperluas.',
    engagement: 3290,
  },
  {
    id: 'm9',
    author: 'Forum Peduli Kota',
    handle: '@forumpedulikota',
    source: 'Portal Berita',
    keyword: 'Isu Lingkungan',
    sentiment: 'Negatif',
    timestamp: '6 jam lalu',
    excerpt: 'Indeks kualitas udara pagi hari masih berada pada kategori sedang-tidak sehat di beberapa koridor industri.',
    engagement: 980,
  },
  {
    id: 'm10',
    author: 'Ahmad Fauzan',
    handle: '@fauzan.tech',
    source: 'YouTube',
    keyword: 'Layanan Publik',
    sentiment: 'Positif',
    timestamp: '7 jam lalu',
    excerpt: 'Integrasi jadwal bus pengumpan dengan stasiun utama memudahkan mobilitas pekerja harian secara signifikan.',
    engagement: 1120,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Lonjakan Sentimen Positif Pendidikan',
    description: 'Program beasiswa dan pemerataan fasilitas sekolah naik +2,1% di Instagram.',
    time: '5 menit lalu',
    unread: true,
    tone: 'positive',
  },
  {
    id: 'n2',
    title: 'Perhatian Isu Biaya Pendidikan',
    description: 'Kata kunci "Biaya Pendidikan" mendominasi 83% topik diskusi publik.',
    time: '42 menit lalu',
    unread: true,
    tone: 'warning',
  },
  {
    id: 'n3',
    title: 'Laporan Mingguan Tersedia',
    description: 'Ringkasan persepsi publik 7 hari terakhir siap diekspor ke CSV.',
    time: '3 jam lalu',
    unread: false,
    tone: 'neutral',
  },
];

function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

function round1(num: number): number {
  return Math.round(num * 10) / 10;
}

export function getDashboardSnapshot(
  source: SourceOption,
  period: PeriodOption,
  keyword: KeywordOption,
  customRange?: { startDate: string; endDate: string }
): DashboardSnapshot {
  const base = KEYWORD_BASE[keyword];
  const srcOffset = SOURCE_OFFSETS[source];

  // Period adjustment
  let periodPosShift = 0;
  let periodNegShift = 0;
  let periodMultiplier = 1;

  if (period === 'Hari ini') {
    periodPosShift = 1.4;
    periodNegShift = -0.7;
    periodMultiplier = 0.22;
  } else if (period === '30 Hari terakhir') {
    periodPosShift = -1.8;
    periodNegShift = 1.1;
    periodMultiplier = 3.8;
  } else if (period === 'Custom') {
    let days = 10;
    if (customRange?.startDate && customRange?.endDate) {
      const start = new Date(customRange.startDate).getTime();
      const end = new Date(customRange.endDate).getTime();
      if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
        days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      }
    }
    periodPosShift = ((days % 7) - 3) * 0.6;
    periodNegShift = ((days % 5) - 2) * 0.4;
    periodMultiplier = Math.max(0.2, days / 7);
  }

  // Exact preservation for key reference states:
  // 1) Beranda.png default: Instagram + 7 Hari terakhir + Isu Pendidikan => 72,5% / 17,3% / 10,2%
  // 2) Beranda 2.png / 3.png default: Semua Sumber + 7 Hari terakhir + Isu Pendidikan => 70,3% / 18,6% / 11,2%
  let posVal: number;
  let negVal: number;
  let neuVal: number;

  if (source === 'Semua Sumber' && period === '7 Hari terakhir' && keyword === 'Isu Pendidikan') {
    posVal = 70.3;
    negVal = 18.6;
    neuVal = 11.2;
  } else {
    posVal = round1(clamp(base.positif + srcOffset.posOffset + periodPosShift, 32, 86));
    negVal = round1(clamp(base.negatif + srcOffset.negOffset + periodNegShift, 6, 48));
    neuVal = round1(clamp(100 - posVal - negVal, 4, 35));
  }

  const deltaPos = round1(base.deltaPos + (period === 'Hari ini' ? 0.5 : period === '30 Hari terakhir' ? -0.4 : 0));
  const deltaNeg = round1(base.deltaNeg + (period === 'Hari ini' ? -0.2 : period === '30 Hari terakhir' ? 0.3 : 0));
  const deltaNeu = round1(base.deltaNeu);

  // Neutral arrow follows prompt's exact default ("↑ - 1,3%") for the default Instagram+7d+Pendidikan state,
  // and adapts cleanly for other filter states.
  const isDefaultDesktop =
    source === 'Instagram' && period === '7 Hari terakhir' && keyword === 'Isu Pendidikan';

  // Generate Trend Series
  let trendSeries: TrendPoint[];
  if (isDefaultDesktop || (source === 'Semua Sumber' && period === '7 Hari terakhir' && keyword === 'Isu Pendidikan')) {
    const scale = source === 'Semua Sumber' ? 1 : 1;
    trendSeries = [
      { label: 'Jan 1', positif: 12 * scale, negatif: 10, netral: 8 },
      { label: 'Jan 2', positif: 14 * scale, negatif: 13, netral: 10 },
      { label: 'Jan 3', positif: 15 * scale, negatif: 15, netral: 12 },
      { label: 'Jan 4', positif: 18 * scale, negatif: 14, netral: 11 },
      { label: 'Jan 5', positif: 20 * scale, negatif: 17, netral: 14 },
      { label: 'Jan 6', positif: 21 * scale, negatif: 20, netral: 16 },
      { label: 'Jan 7', positif: 24 * scale, negatif: 18, netral: 15 },
    ];
  } else if (period === 'Hari ini') {
    const factor = posVal / 72.5;
    trendSeries = [
      { label: '08:00', positif: Math.round(9 * factor), negatif: 7, netral: 6 },
      { label: '10:00', positif: Math.round(12 * factor), negatif: 9, netral: 8 },
      { label: '12:00', positif: Math.round(16 * factor), negatif: 11, netral: 9 },
      { label: '14:00', positif: Math.round(18 * factor), negatif: 10, netral: 10 },
      { label: '16:00', positif: Math.round(21 * factor), negatif: 13, netral: 11 },
      { label: '18:00', positif: Math.round(23 * factor), negatif: 12, netral: 9 },
      { label: '20:00', positif: Math.round(24 * factor), negatif: 11, netral: 8 },
    ];
  } else if (period === '30 Hari terakhir') {
    const factor = posVal / 72.5;
    trendSeries = [
      { label: 'Mg 1', positif: Math.round(14 * factor), negatif: 13, netral: 10 },
      { label: 'Mg 2', positif: Math.round(16 * factor), negatif: 15, netral: 12 },
      { label: 'Mg 3', positif: Math.round(15 * factor), negatif: 18, netral: 13 },
      { label: 'Mg 4', positif: Math.round(19 * factor), negatif: 16, netral: 12 },
      { label: 'Mg 5', positif: Math.round(22 * factor), negatif: 14, netral: 11 },
      { label: 'Mg 6', positif: Math.round(23 * factor), negatif: 15, netral: 13 },
    ];
  } else {
    const factor = posVal / 72.5;
    const baseDates = ['H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'H-1', 'Akhir'];
    if (customRange?.startDate && customRange?.endDate) {
      const start = new Date(customRange.startDate);
      const end = new Date(customRange.endDate);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end >= start) {
        const span = Math.max(1, end.getTime() - start.getTime());
        trendSeries = baseDates.map((_, idx) => {
          const d = new Date(start.getTime() + (span * idx) / 6);
          const lbl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          return {
            label: lbl,
            positif: Math.round((11 + idx * 2) * factor),
            negatif: Math.round(9 + (idx % 3) * 3 + idx),
            netral: Math.round(7 + (idx % 2) * 3 + idx * 0.8),
          };
        });
      } else {
        trendSeries = [
          { label: 'Jan 1', positif: Math.round(12 * factor), negatif: 11, netral: 8 },
          { label: 'Jan 2', positif: Math.round(14 * factor), negatif: 12, netral: 9 },
          { label: 'Jan 3', positif: Math.round(16 * factor), negatif: 14, netral: 11 },
          { label: 'Jan 4', positif: Math.round(18 * factor), negatif: 13, netral: 10 },
          { label: 'Jan 5', positif: Math.round(20 * factor), negatif: 16, netral: 12 },
          { label: 'Jan 6', positif: Math.round(22 * factor), negatif: 15, netral: 13 },
        ];
      }
    } else {
      trendSeries = [
        { label: 'Jan 1', positif: Math.round(12 * factor), negatif: 11, netral: 8 },
        { label: 'Jan 2', positif: Math.round(14 * factor), negatif: 12, netral: 9 },
        { label: 'Jan 3', positif: Math.round(16 * factor), negatif: 14, netral: 11 },
        { label: 'Jan 4', positif: Math.round(18 * factor), negatif: 13, netral: 10 },
        { label: 'Jan 5', positif: Math.round(20 * factor), negatif: 16, netral: 12 },
        { label: 'Jan 6', positif: Math.round(22 * factor), negatif: 15, netral: 13 },
      ];
    }
  }

  // Adjust topic trends lightly by source & period
  const topicShift = source === 'Instagram' ? 0 : source === 'X / Twitter' ? -3 : source === 'TikTok' ? 2 : -1;
  const topicTrends = base.topics.map((t, idx) => ({
    ...t,
    percentage: isDefaultDesktop
      ? t.percentage
      : clamp(t.percentage + topicShift - (period === 'Hari ini' ? 2 : 0) + (idx === 0 ? 0 : 1), 24, 94),
  }));

  const sourceBreakdowns: SourceBreakdown[] = (
    ['Instagram', 'X / Twitter', 'TikTok', 'Portal Berita', 'YouTube'] as const
  ).map((src) => {
    const off = SOURCE_OFFSETS[src];
    const p = round1(clamp(base.positif + off.posOffset + periodPosShift, 35, 85));
    const n = round1(clamp(base.negatif + off.negOffset + periodNegShift, 8, 45));
    const neu = round1(clamp(100 - p - n, 5, 30));
    const vol = Math.round(3200 * off.volumeMultiplier * periodMultiplier);
    return {
      source: src,
      positif: p,
      negatif: n,
      netral: neu,
      volume: vol,
    };
  });

  const filteredMentions = ALL_MENTIONS.filter((m) => {
    const matchSrc = source === 'Semua Sumber' || m.source === source;
    const matchKw = keyword === 'Semua Kata Kunci' || m.keyword === keyword;
    return matchSrc && matchKw;
  });

  // Ensure non-empty mentions fallback with partial match if strict intersection is narrow
  const mentions =
    filteredMentions.length > 0
      ? filteredMentions
      : ALL_MENTIONS.filter((m) => source === 'Semua Sumber' || m.source === source || m.keyword === keyword);

  const totalMentions = Math.round(3420 * srcOffset.volumeMultiplier * periodMultiplier);

  return {
    positif: {
      value: posVal,
      delta: deltaPos,
      arrow: deltaPos >= 0 ? 'up' : 'down',
    },
    negatif: {
      value: negVal,
      delta: deltaNeg,
      arrow: deltaNeg >= 0 ? 'up' : 'down',
    },
    netral: {
      value: neuVal,
      delta: deltaNeu,
      arrow: isDefaultDesktop ? 'up' : deltaNeu >= 0 ? 'up' : 'down',
    },
    insightText: deltaPos >= 0 ? base.insightUp : base.insightDown,
    insightPositive: deltaPos >= 0,
    trendSeries,
    topicTrends,
    recommendations:
      source === 'Semua Sumber' || source === 'Instagram'
        ? base.recommendations
        : [
            ...base.recommendations,
            `Sesuaikan format konten respons cepat untuk audiens ${source} pada periode ${period.toLowerCase()}`,
          ],
    totalMentions,
    sourceBreakdowns,
    mentions,
  };
}
