'use client';

import React from 'react';
import { SubjectScore, KoreanSubject, MathSubject, InquirySubject } from '@/types';

interface ScoreInputProps {
  label: string;
  score: SubjectScore;
  onChange: (score: SubjectScore) => void;
  subjectType: 'korean' | 'math' | 'inquiry';
}

const koreanSubjects: KoreanSubject[] = ['화법과작문', '언어와매체'];
const mathSubjects: MathSubject[] = ['확률과통계', '미적분', '기하'];
const inquirySubjects: InquirySubject[] = [
  // 사회탐구
  '생활과윤리', '윤리와사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와법', '사회문화',
  // 과학탐구
  '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
  '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ',
];

export default function ScoreInput({ label, score, onChange, subjectType }: ScoreInputProps) {
  const handleChange = (field: keyof SubjectScore, value: string) => {
    const numValue = value === '' ? null : (field === 'selectedSubject' ? value : parseInt(value));
    onChange({
      ...score,
      [field]: numValue,
    });
  };

  const getSubjectOptions = () => {
    switch (subjectType) {
      case 'korean':
        return koreanSubjects;
      case 'math':
        return mathSubjects;
      case 'inquiry':
        return inquirySubjects;
      default:
        return [];
    }
  };

  const subjectOptions = getSubjectOptions();

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{label}</h3>

      {/* 선택과목 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          선택과목
        </label>
        <select
          value={score.selectedSubject ?? ''}
          onChange={(e) => handleChange('selectedSubject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">선택하세요</option>
          {subjectOptions.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

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
