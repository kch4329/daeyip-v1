'use client';

import React from 'react';
import { SubjectScore } from '@/types';

interface ScoreInputProps {
  label: string;
  score: SubjectScore;
  onChange: (score: SubjectScore) => void;
  showSecondLanguage?: boolean;
}

export default function ScoreInput({ label, score, onChange, showSecondLanguage = false }: ScoreInputProps) {
  const handleChange = (field: keyof SubjectScore, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    onChange({
      ...score,
      [field]: numValue,
    });
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 표준점수 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            표준점수
          </label>
          <input
            type="number"
            value={score.standardScore ?? ''}
            onChange={(e) => handleChange('standardScore', e.target.value)}
            placeholder="예: 130"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="200"
          />
        </div>

        {/* 백분위 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            백분위
          </label>
          <input
            type="number"
            value={score.percentile ?? ''}
            onChange={(e) => handleChange('percentile', e.target.value)}
            placeholder="예: 95"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* 등급 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            등급
          </label>
          <select
            value={score.grade ?? ''}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">선택</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
              <option key={grade} value={grade}>
                {grade}등급
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
