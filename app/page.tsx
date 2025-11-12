'use client';

import React, { useState } from 'react';
import ScoreInput from '@/components/ScoreInput';
import AbsoluteScoreInput from '@/components/AbsoluteScoreInput';
import ImageUpload from '@/components/ImageUpload';
import UniversitySelector from '@/components/UniversitySelector';
import PredictionResultComponent from '@/components/PredictionResult';
import Header from '@/components/Header';
import { ExamScores, Track, PredictionResult } from '@/types';
import { calculateUniversityScore, validateScores } from '@/lib/scoreCalculator';
import { predictAdmission } from '@/lib/predictionEngine';
import { getAdmissionDataByDepartment } from '@/data/admissionData';
import { getDepartmentById } from '@/data/universities';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { isAuthenticated, token } = useAuthStore();

  // 탭 상태 (성적 입력 / 사진 업로드)
  const [activeTab, setActiveTab] = useState<'manual' | 'photo'>('manual');

  // 성적 상태
  const [scores, setScores] = useState<ExamScores>({
    korean: { selectedSubject: null, standardScore: null, percentile: null, grade: null },
    math: { selectedSubject: null, standardScore: null, percentile: null, grade: null },
    english: { grade: null },
    koreanHistory: { grade: null },
    inquiry1: { selectedSubject: null, standardScore: null, percentile: null, grade: null },
    inquiry2: { selectedSubject: null, standardScore: null, percentile: null, grade: null },
  });

  // 대학 선택 상태
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // 예측 결과
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  // 저장된 성적 ID (예측 결과 저장 시 필요)
  const [savedScoreId, setSavedScoreId] = useState<string | null>(null);

  // OCR로 추출된 성적 자동 입력
  const handleScoresExtracted = (extractedScores: Partial<ExamScores>) => {
    setScores((prev) => ({
      ...prev,
      ...extractedScores,
    }));
  };

  // 합격 예측 수행
  const handlePredict = async () => {
    // 유효성 검사
    if (!validateScores(scores)) {
      alert('최소한 필수 과목의 성적을 입력해주세요.');
      return;
    }

    if (!selectedUniversity || !selectedTrack || !selectedDepartment) {
      alert('대학교, 계열, 모집단위를 모두 선택해주세요.');
      return;
    }

    // 환산점수 계산
    const convertedScore = calculateUniversityScore(
      selectedUniversity,
      selectedDepartment,
      scores
    );

    // 과거 입시 데이터 조회
    const historicalData = getAdmissionDataByDepartment(
      selectedUniversity,
      selectedDepartment
    );

    if (historicalData.length === 0) {
      alert('해당 대학/학과의 입시 데이터가 없습니다.');
      return;
    }

    // 대학/학과 정보 조회
    const deptInfo = getDepartmentById(selectedUniversity, selectedDepartment);
    if (!deptInfo) {
      alert('대학/학과 정보를 찾을 수 없습니다.');
      return;
    }

    // 합격 예측
    const result = predictAdmission(
      deptInfo.university.name,
      deptInfo.department.name,
      selectedTrack,
      convertedScore,
      historicalData
    );

    setPredictionResult(result);

    // 로그인한 사용자의 경우 성적과 예측 결과 저장
    if (isAuthenticated && token) {
      try {
        // 1. 성적 저장
        const scoreResponse = await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            koreanSubject: scores.korean.selectedSubject,
            koreanStandardScore: scores.korean.standardScore,
            koreanPercentile: scores.korean.percentile,
            koreanGrade: scores.korean.grade,
            mathSubject: scores.math.selectedSubject,
            mathStandardScore: scores.math.standardScore,
            mathPercentile: scores.math.percentile,
            mathGrade: scores.math.grade,
            englishGrade: scores.english.grade,
            inquiry1Subject: scores.inquiry1.selectedSubject,
            inquiry1StandardScore: scores.inquiry1.standardScore,
            inquiry1Percentile: scores.inquiry1.percentile,
            inquiry1Grade: scores.inquiry1.grade,
            inquiry2Subject: scores.inquiry2.selectedSubject,
            inquiry2StandardScore: scores.inquiry2.standardScore,
            inquiry2Percentile: scores.inquiry2.percentile,
            inquiry2Grade: scores.inquiry2.grade,
            koreanHistoryGrade: scores.koreanHistory.grade,
            secondLanguageGrade: scores.secondLanguage?.grade,
          }),
        });

        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          setSavedScoreId(scoreData.score.id);

          // 2. 예측 결과 저장
          await fetch('/api/predictions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              userScoreId: scoreData.score.id,
              departmentId: selectedDepartment,
              convertedScore: result.convertedScore,
              predictionLevel: result.level,
              probability: result.probability,
              scoreDifference: result.scoreDifference,
            }),
          });
        }
      } catch (error) {
        console.error('성적/예측 결과 저장 오류:', error);
        // 저장 실패해도 예측 결과는 표시
      }
    }

    // 결과로 스크롤
    setTimeout(() => {
      document.getElementById('prediction-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 성적 입력/사진 업로드 탭 섹션 */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 탭 헤더 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📝 직접 입력
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'photo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📸 사진 업로드
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="p-6">
              {activeTab === 'manual' ? (
                // 직접 입력 탭
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    수능 성적 입력
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    각 과목별로 선택과목과 성적을 입력해주세요.
                  </p>

                  {/* 국어 */}
                  <ScoreInput
                    label="국어"
                    score={scores.korean}
                    onChange={(score) => setScores({ ...scores, korean: score })}
                    subjectType="korean"
                  />

                  {/* 수학 */}
                  <ScoreInput
                    label="수학"
                    score={scores.math}
                    onChange={(score) => setScores({ ...scores, math: score })}
                    subjectType="math"
                  />

                  {/* 영어 (절대평가) */}
                  <AbsoluteScoreInput
                    label="영어"
                    score={scores.english}
                    onChange={(score) => setScores({ ...scores, english: score })}
                  />

                  {/* 한국사 (절대평가) */}
                  <AbsoluteScoreInput
                    label="한국사"
                    score={scores.koreanHistory}
                    onChange={(score) => setScores({ ...scores, koreanHistory: score })}
                  />

                  {/* 탐구 1 */}
                  <ScoreInput
                    label="탐구 1"
                    score={scores.inquiry1}
                    onChange={(score) => setScores({ ...scores, inquiry1: score })}
                    subjectType="inquiry"
                  />

                  {/* 탐구 2 */}
                  <ScoreInput
                    label="탐구 2"
                    score={scores.inquiry2}
                    onChange={(score) => setScores({ ...scores, inquiry2: score })}
                    subjectType="inquiry"
                  />
                </div>
              ) : (
                // 사진 업로드 탭
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    성적표 사진 업로드
                  </h2>
                  <ImageUpload onScoresExtracted={handleScoresExtracted} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 대학 선택 섹션 */}
        <section className="mb-8">
          <UniversitySelector
            selectedUniversity={selectedUniversity}
            selectedTrack={selectedTrack}
            selectedDepartment={selectedDepartment}
            onUniversityChange={setSelectedUniversity}
            onTrackChange={setSelectedTrack}
            onDepartmentChange={setSelectedDepartment}
          />
        </section>

        {/* 합격 예측 버튼 */}
        <section className="mb-8">
          <button
            onClick={handlePredict}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            🔍 합격 가능성 예측하기
          </button>
        </section>

        {/* 예측 결과 섹션 */}
        {predictionResult && (
          <section id="prediction-result">
            <PredictionResultComponent result={predictionResult} />
          </section>
        )}

        {/* 안내 메시지 */}
        {!predictionResult && (
          <section className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 사용 방법
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>성적표 사진을 업로드하거나 수능 성적을 직접 입력하세요.</li>
              <li>지원하고자 하는 대학교, 계열, 모집단위를 선택하세요.</li>
              <li>'합격 가능성 예측하기' 버튼을 클릭하세요.</li>
              <li>환산점수, 과거 입시 데이터, 합격 가능성을 확인하세요.</li>
            </ol>
          </section>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-16 bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2024 대입 정시모집 합격 예측 서비스. All rights reserved.
            </p>
            <p className="text-xs mt-2 text-gray-400">
              본 서비스는 과거 데이터를 기반으로 한 예측이므로, 실제 합격 여부와 다를 수 있습니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
