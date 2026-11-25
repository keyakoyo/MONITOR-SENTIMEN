import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import {
  SourceOption,
  PeriodOption,
  KeywordOption,
  SOURCE_OPTIONS,
  PERIOD_OPTIONS,
  KEYWORD_OPTIONS,
} from '../data/sentimentData';

interface TopFilterDropdownsProps {
  source: SourceOption;
  period: PeriodOption;
  keyword: KeywordOption;
  onChangeSource: (s: SourceOption) => void;
  onChangePeriod: (p: PeriodOption) => void;
  onChangeKeyword: (k: KeywordOption) => void;
}

export const TopFilterDropdowns: React.FC<TopFilterDropdownsProps> = ({
  source,
  period,
  keyword,
  onChangeSource,
  onChangePeriod,
  onChangeKeyword,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {/* Sumber */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-sumber"
          className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] pl-1"
        >
          Sumber
        </label>
        <div className="relative">
          <select
            id="filter-sumber"
            value={source}
            onChange={(e) => onChangeSource(e.target.value as SourceOption)}
            className="w-full appearance-none rounded-full bg-[#CFD6DE] px-4 py-2.5 pr-10 text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-[#C3CCD6] focus:outline-none focus:ring-2 focus:ring-[#3B0A6D] cursor-pointer"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Periode */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-periode"
          className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] pl-1"
        >
          Periode
        </label>
        <div className="relative">
          <select
            id="filter-periode"
            value={period}
            onChange={(e) => onChangePeriod(e.target.value as PeriodOption)}
            className="w-full appearance-none rounded-full bg-[#CFD6DE] px-4 py-2.5 pr-10 text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-[#C3CCD6] focus:outline-none focus:ring-2 focus:ring-[#3B0A6D] cursor-pointer"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Kata kunci */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-katakunci"
          className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] pl-1"
        >
          Kata kunci
        </label>
        <div className="relative">
          <select
            id="filter-katakunci"
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value as KeywordOption)}
            className="w-full appearance-none rounded-full bg-[#CFD6DE] px-4 py-2.5 pr-10 text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-[#C3CCD6] focus:outline-none focus:ring-2 focus:ring-[#3B0A6D] cursor-pointer"
          >
            {KEYWORD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

interface QuickPeriodPillsProps {
  period: PeriodOption;
  customRange: { startDate: string; endDate: string };
  onSelectPeriod: (p: PeriodOption) => void;
  onChangeCustomRange: (range: { startDate: string; endDate: string }) => void;
  centered?: boolean;
}

export const QuickPeriodPills: React.FC<QuickPeriodPillsProps> = ({
  period,
  customRange,
  onSelectPeriod,
  onChangeCustomRange,
  centered = false,
}) => {
  const [showCustomDates, setShowCustomDates] = useState(period === 'Custom');

  const pills: { label: string; value: PeriodOption }[] = [
    { label: 'Hari ini', value: 'Hari ini' },
    { label: '7 Hari', value: '7 Hari terakhir' },
    { label: '30 Hari', value: '30 Hari terakhir' },
    { label: 'Custom ▾', value: 'Custom' },
  ];

  const handlePillClick = (val: PeriodOption) => {
    onSelectPeriod(val);
    if (val === 'Custom') {
      setShowCustomDates((prev) => (period === 'Custom' ? !prev : true));
    } else {
      setShowCustomDates(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex flex-wrap items-center gap-2.5 ${
          centered ? 'justify-center' : 'justify-start'
        }`}
        role="group"
        aria-label="Filter cepat periode waktu"
      >
        {pills.map((pill) => {
          const isActive = period === pill.value;
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => handlePillClick(pill.value)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-[13px] sm:text-[14px] font-semibold whitespace-nowrap shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0A6D] ${
                isActive
                  ? 'bg-[#6D28D9] text-white shadow-sm'
                  : 'bg-[#A78BFA] text-[#1E1B4B] hover:bg-[#9977FA]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {(showCustomDates || period === 'Custom') && (
        <div
          className={`flex flex-wrap items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-xs sm:text-sm ${
            centered ? 'justify-center' : 'justify-start'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold text-[#3B0A6D]">
            <Calendar className="h-4 w-4" />
            <span>Rentang Tanggal:</span>
          </div>
          <label className="flex items-center gap-1.5 text-slate-700">
            <span className="font-medium">Mulai</span>
            <input
              type="date"
              value={customRange.startDate}
              max={customRange.endDate}
              onChange={(e) =>
                onChangeCustomRange({ ...customRange, startDate: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-[#6D28D9] focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-1.5 text-slate-700">
            <span className="font-medium">Akhir</span>
            <input
              type="date"
              value={customRange.endDate}
              min={customRange.startDate}
              onChange={(e) =>
                onChangeCustomRange({ ...customRange, endDate: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-[#6D28D9] focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
};
