import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  TopicTrendItem,
  PopularTopicKey,
} from '../data/sentimentData';

interface InsightBannerProps {
  text: string;
  positive: boolean;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({ text, positive }) => {
  return (
    <div
      className="flex items-center gap-3.5 rounded-full bg-[#F8DFBE] px-5 py-3.5 text-[#0F172A]"
      role="status"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/60">
        {positive ? (
          <TrendingUp className="h-5 w-5 text-[#7CA83A] stroke-[2.5]" />
        ) : (
          <TrendingDown className="h-5 w-5 text-[#C2410C] stroke-[2.5]" />
        )}
      </div>
      <p className="text-[13px] sm:text-[14px] font-medium leading-snug text-[#0F172A] max-w-md">
        {text}
      </p>
    </div>
  );
};

interface TopicTrendListProps {
  topics: TopicTrendItem[];
  highlightedTopic: string | null;
  onSelectTopicName: (name: string) => void;
}

export const TopicTrendList: React.FC<TopicTrendListProps> = ({
  topics,
  highlightedTopic,
  onSelectTopicName,
}) => {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6">
      <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A]">Tren Topik</h2>

      <div className="mt-5 flex flex-col gap-4">
        {topics.map((topic) => {
          const isHighlighted = highlightedTopic === topic.name;
          return (
            <button
              key={topic.name}
              type="button"
              onClick={() => onSelectTopicName(topic.name)}
              className={`group grid w-full grid-cols-[28px_minmax(130px,1fr)_minmax(90px,1.4fr)_44px] items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors ${
                isHighlighted ? 'bg-violet-50' : 'hover:bg-slate-50'
              }`}
            >
              <span className="text-[14px] font-semibold text-slate-700 tabular-nums">
                #{topic.rank}
              </span>
              <span className="truncate text-[14px] font-medium text-[#0F172A]">
                {topic.name}
              </span>
              {/* Two-tone horizontal progress bar */}
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="flex h-full overflow-hidden rounded-full transition-all duration-300"
                  style={{ width: `${topic.percentage}%` }}
                >
                  <div
                    className="h-full bg-[#A98BF9]"
                    style={{ width: `${topic.purpleShare}%` }}
                  />
                  <div
                    className="h-full bg-[#3B7BFF]"
                    style={{ width: `${100 - topic.purpleShare}%` }}
                  />
                </div>
              </div>
              <span className="text-right text-[14px] font-bold text-[#0F172A] tabular-nums">
                {topic.percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface PopularTopicPillsProps {
  activeTopic: PopularTopicKey;
  onSelectTopic: (topic: PopularTopicKey) => void;
  centered?: boolean;
}

export const PopularTopicPills: React.FC<PopularTopicPillsProps> = ({
  activeTopic,
  onSelectTopic,
  centered = false,
}) => {
  const [showMore, setShowMore] = useState(false);

  const primaryTopics: PopularTopicKey[] = ['Pendidikan', 'Lingkungan', 'Ekonomi'];
  const extraTopics: PopularTopicKey[] = ['Layanan Publik', 'Kesehatan'];
  const visibleTopics = showMore ? [...primaryTopics, ...extraTopics] : primaryTopics;

  return (
    <div>
      <h2
        className={`text-[18px] sm:text-[20px] font-bold text-[#0F172A] ${
          centered ? 'text-center' : 'text-left'
        }`}
      >
        Topik Populer
      </h2>

      <div
        className={`mt-3.5 flex flex-wrap items-center gap-2.5 ${
          centered ? 'justify-center' : 'justify-start'
        }`}
      >
        {visibleTopics.map((topic) => {
          const isActive = activeTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic(topic)}
              aria-pressed={isActive}
              className={`rounded-full px-5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D] ${
                isActive
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-[#C5CFD9] text-[#0F172A] hover:bg-[#B4C0CC]'
              }`}
            >
              {topic}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          aria-expanded={showMore}
          aria-label={showMore ? 'Sembunyikan topik tambahan' : 'Tampilkan topik lainnya'}
          className="rounded-full bg-[#C5CFD9] px-4 py-2 text-[14px] font-bold text-[#0F172A] hover:bg-[#B4C0CC] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D]"
        >
          {showMore ? 'Ringkas' : '...'}
        </button>
      </div>
    </div>
  );
};

interface RecommendationBoxProps {
  recommendations: string[];
}

export const RecommendationBox: React.FC<RecommendationBoxProps> = ({ recommendations }) => {
  return (
    <div className="rounded-[28px] bg-[#CED6DF] p-6 sm:p-7 text-[#0F172A]">
      <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A]">
        Rekomendasi Tindak Lanjut
      </h2>
      <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-[#0F172A]">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="font-medium">
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
};
