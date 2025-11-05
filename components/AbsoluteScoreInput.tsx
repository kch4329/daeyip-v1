'use client';

import React from 'react';
import { AbsoluteScore } from '@/types';

interface AbsoluteScoreInputProps {
  label: string;
  score: AbsoluteScore;
  onChange: (score: AbsoluteScore) => void;
}

export default function AbsoluteScoreInput({ label, score, onChange }: AbsoluteScoreInputProps) {
  const handleChange = (value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    onChange({
      grade: numValue,
    });
  };

  return (
    <div className="mb-4 p-4 bg-amber-50 rounded-lg shadow-sm border border-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">{label}</h3>
          <p className="text-xs text-amber-600">절대평가 (등급만 입력)</p>
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            등급
          </label>
          <select
            value={score.grade ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
