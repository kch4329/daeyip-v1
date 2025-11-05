'use client';

import React, { useState, useRef } from 'react';
import { ExamScores } from '@/types';

interface ImageUploadProps {
  onScoresExtracted: (scores: Partial<ExamScores>) => void;
}

export default function ImageUpload({ onScoresExtracted }: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // OCR 처리
    setIsProcessing(true);
    try {
      await processImageWithOCR(file);
    } catch (error) {
      console.error('OCR 처리 중 오류:', error);
      alert('성적표 인식에 실패했습니다. 수동으로 입력해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImageWithOCR = async (file: File) => {
    // TODO: 실제 OCR 처리 로직 구현
    // Tesseract.js 또는 Cloud Vision API 사용

    // 임시 처리: 2초 후 더미 데이터 반환
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 더미 데이터 (실제로는 OCR 결과를 파싱하여 반환)
    const dummyScores: Partial<ExamScores> = {
      korean: { selectedSubject: '화법과작문', standardScore: 130, percentile: 92, grade: 2 },
      math: { selectedSubject: '미적분', standardScore: 135, percentile: 95, grade: 1 },
      english: { grade: 2 },
      koreanHistory: { grade: 3 },
      inquiry1: { selectedSubject: '생명과학Ⅰ', standardScore: 68, percentile: 90, grade: 2 },
      inquiry2: { selectedSubject: '지구과학Ⅰ', standardScore: 65, percentile: 88, grade: 2 },
    };

    onScoresExtracted(dummyScores);
    alert('성적표가 인식되었습니다! 자동으로 입력된 값을 확인해주세요.');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-300">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        📸 성적표 사진 업로드
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        성적표 사진을 업로드하면 자동으로 성적이 입력됩니다.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            처리 중...
          </span>
        ) : (
          '사진 선택하기'
        )}
      </button>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">업로드된 이미지:</p>
          <img
            src={preview}
            alt="성적표 미리보기"
            className="max-w-full h-auto rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}
