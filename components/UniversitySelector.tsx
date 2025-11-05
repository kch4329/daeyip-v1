'use client';

import React, { useState, useEffect } from 'react';
import { universities, getUniversityById } from '@/data/universities';
import { Track } from '@/types';

interface UniversitySelectorProps {
  selectedUniversity: string | null;
  selectedTrack: Track | null;
  selectedDepartment: string | null;
  onUniversityChange: (universityId: string) => void;
  onTrackChange: (track: Track) => void;
  onDepartmentChange: (departmentId: string) => void;
}

export default function UniversitySelector({
  selectedUniversity,
  selectedTrack,
  selectedDepartment,
  onUniversityChange,
  onTrackChange,
  onDepartmentChange,
}: UniversitySelectorProps) {
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);

  useEffect(() => {
    if (selectedUniversity && selectedTrack) {
      const university = getUniversityById(selectedUniversity);
      if (university) {
        const filtered = university.departments.filter(
          (dept) => dept.track === selectedTrack
        );
        setAvailableDepartments(filtered);
      }
    } else {
      setAvailableDepartments([]);
    }
  }, [selectedUniversity, selectedTrack]);

  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        🎓 지원 희망 대학 선택
      </h3>

      <div className="space-y-4">
        {/* 대학교 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            대학교
          </label>
          <select
            value={selectedUniversity || ''}
            onChange={(e) => {
              onUniversityChange(e.target.value);
              onDepartmentChange(''); // 대학 변경 시 학과 초기화
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="">대학교를 선택하세요</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>

        {/* 계열 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계열
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['인문', '자연', '예체능'] as Track[]).map((track) => (
              <button
                key={track}
                onClick={() => {
                  onTrackChange(track);
                  onDepartmentChange(''); // 계열 변경 시 학과 초기화
                }}
                className={`py-3 px-4 rounded-md font-medium transition-colors ${
                  selectedTrack === track
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* 모집단위 선택 */}
        {selectedUniversity && selectedTrack && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              모집단위
            </label>
            <select
              value={selectedDepartment || ''}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="">모집단위를 선택하세요</option>
              {availableDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} (정원: {dept.quota}명)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 선택 정보 표시 */}
        {selectedUniversity && selectedTrack && selectedDepartment && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              선택하신 모집단위:
            </p>
            <p className="text-lg font-bold text-blue-700 mt-1">
              {getUniversityById(selectedUniversity)?.name} /{' '}
              {
                getUniversityById(selectedUniversity)?.departments.find(
                  (d) => d.id === selectedDepartment
                )?.name
              }{' '}
              ({selectedTrack})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
