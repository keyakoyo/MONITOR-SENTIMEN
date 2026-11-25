import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieLabelRenderProps,
} from 'recharts';
import {
  DashboardSnapshot,
  formatIndonesianPercent,
  formatDotPercent,
  formatSignedDelta,
} from '../data/sentimentData';

interface SentimentMetricCardsProps {
  snapshot: DashboardSnapshot;
  onCardClick?: (sentiment: 'Positif' | 'Negatif' | 'Netral') => void;
}

export const SentimentMetricCards: React.FC<SentimentMetricCardsProps> = ({
  snapshot,
  onCardClick,
}) => {
  const cards = [
    {
      key: 'Positif' as const,
      bg: 'bg-[#C2EEB3]',
      hoverBg: 'hover:bg-[#B7E7A7]',
      value: formatIndonesianPercent(snapshot.positif.value),
      label: 'Sentimen positif',
      arrow: snapshot.positif.arrow === 'up' ? '↑' : '↓',
      delta: formatSignedDelta(snapshot.positif.delta),
    },
    {
      key: 'Negatif' as const,
      bg: 'bg-[#FF9E9E]',
      hoverBg: 'hover:bg-[#FA9191]',
      value: formatIndonesianPercent(snapshot.negatif.value),
      label: 'Sentimen negatif',
      arrow: snapshot.negatif.arrow === 'up' ? '↑' : '↓',
      delta: formatSignedDelta(snapshot.negatif.delta),
    },
    {
      key: 'Netral' as const,
      bg: 'bg-[#B2C2FF]',
      hoverBg: 'hover:bg-[#A4B7FF]',
      value: formatIndonesianPercent(snapshot.netral.value),
      label: 'Sentimen netral',
      arrow: snapshot.netral.arrow === 'up' ? '↑' : '↓',
      delta: formatSignedDelta(snapshot.netral.delta),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {cards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={() => onCardClick?.(card.key)}
          className={`group flex flex-col justify-between rounded-[26px] ${card.bg} ${card.hoverBg} px-6 py-6 text-left transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D]`}
        >
          <div className="text-[36px] sm:text-[40px] font-extrabold leading-none tracking-tight text-[#0F172A] tabular-nums">
            {card.value}
          </div>
          <div className="mt-4 text-[16px] font-medium text-[#0F172A]">{card.label}</div>
          <div className="mt-2.5 text-[15px] font-semibold text-[#0F172A] tabular-nums">
            <span className="mr-1.5" aria-hidden="true">
              {card.arrow}
            </span>
            <span>{card.delta}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

interface SentimentDonutCardProps {
  snapshot: DashboardSnapshot;
  compact?: boolean;
}

const DONUT_COLORS = {
  Positif: '#8CE96A',
  Negatif: '#FF9999',
  Netral: '#C5CFD9',
};

export const SentimentDonutCard: React.FC<SentimentDonutCardProps> = ({ snapshot, compact = false }) => {
  const pieData = [
    { name: 'Positif', value: snapshot.positif.value, color: DONUT_COLORS.Positif },
    { name: 'Negatif', value: snapshot.negatif.value, color: DONUT_COLORS.Negatif },
    { name: 'Netral', value: snapshot.netral.value, color: DONUT_COLORS.Netral },
  ];

  const renderOutsideLabel = (props: PieLabelRenderProps) => {
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = Number(props.midAngle ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const value = Number(props.value ?? 0);

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#0F172A"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[11px] font-semibold tabular-nums"
      >
        {formatDotPercent(value)}
      </text>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${
        compact ? 'py-2' : 'rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6'
      }`}
    >
      {/* Donut Chart with Center Label */}
      <div className="relative h-[220px] w-full max-w-[260px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={82}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              paddingAngle={1}
              labelLine={false}
              label={renderOutsideLabel}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: unknown, name: unknown) => [
                formatIndonesianPercent(Number(value)),
                String(name),
              ]}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Hole Metric */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold leading-tight text-[#0F172A] tabular-nums">
            {formatIndonesianPercent(snapshot.positif.value)}
          </span>
          <span className="text-xs font-medium text-slate-600">Positif</span>
        </div>
      </div>

      {/* Right Side Legend */}
      <div className="flex w-full max-w-[220px] flex-col gap-3 sm:pr-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-[#0F172A]">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-[#0F172A] tabular-nums">
              {formatDotPercent(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SentimentTrendChartProps {
  snapshot: DashboardSnapshot;
  compact?: boolean;
}

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({
  snapshot,
  compact = false,
}) => {
  return (
    <div
      className={
        compact
          ? 'w-full'
          : 'rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6'
      }
    >
      <h2
        className={`text-[18px] sm:text-[20px] font-bold text-[#0F172A] ${
          compact ? 'text-center' : 'text-left'
        }`}
      >
        Tren Sentimen
      </h2>

      {/* Top Dot Legend */}
      <div
        className={`mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] font-medium text-[#0F172A] ${
          compact ? 'justify-center' : 'justify-start'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2B7FFF]" aria-hidden="true" />
          <span>Sentimen Positif</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#A78BFA]" aria-hidden="true" />
          <span>Sentimen negatif</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5B958]" aria-hidden="true" />
          <span>Sentimen netral</span>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="mt-4 h-[235px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={snapshot.trendSeries}
            margin={{ top: 10, right: 16, left: -18, bottom: 4 }}
          >
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 12 }}
            />
            <RechartsTooltip
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                fontSize: '12px',
              }}
              labelStyle={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="positif"
              name="Sentimen Positif"
              stroke="#2B7FFF"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#2B7FFF', strokeWidth: 0 }}
              activeDot={{ r: 5.5, fill: '#2B7FFF', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="negatif"
              name="Sentimen negatif"
              stroke="#A78BFA"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#A78BFA', strokeWidth: 0 }}
              activeDot={{ r: 5.5, fill: '#A78BFA', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="netral"
              name="Sentimen netral"
              stroke="#F5B958"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#F5B958', strokeWidth: 0 }}
              activeDot={{ r: 5.5, fill: '#F5B958', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
