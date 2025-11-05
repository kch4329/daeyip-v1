import { PredictionLevel, PredictionResult, AdmissionData } from '@/types';

/**
 * 합격 예측 엔진
 * 사용자의 환산점수와 과거 입시 데이터를 비교하여 합격 가능성을 예측
 */

// 합격 예측 수행
export function predictAdmission(
  universityName: string,
  departmentName: string,
  track: '인문' | '자연' | '예체능',
  convertedScore: number,
  historicalData: AdmissionData[]
): PredictionResult {
  if (historicalData.length === 0) {
    throw new Error('과거 입시 데이터가 없습니다.');
  }

  // 최신 데이터 사용
  const latestData = historicalData[0];
  const cutScore70 = latestData.cutScore70;
  const cutScoreAvg = latestData.cutScoreAvg;
  const cutScoreTop = latestData.cutScoreTop;

  // 평균 컷과의 점수 차이
  const scoreDifference = convertedScore - cutScoreAvg;

  // 합격 가능성 레벨 결정
  const level = determinePredictionLevel(convertedScore, latestData);

  // 합격 확률 계산 (0-100%)
  const probability = calculateProbability(convertedScore, latestData);

  return {
    universityName,
    departmentName,
    track,
    convertedScore,
    cutScore70,
    cutScoreAvg,
    level,
    probability,
    scoreDifference,
    yearlyData: historicalData,
  };
}

// 합격 가능성 레벨 결정
function determinePredictionLevel(
  score: number,
  data: AdmissionData
): PredictionLevel {
  const { cutScore70, cutScoreAvg, cutScoreTop } = data;

  // 안정: 평균 컷보다 5점 이상 높음
  if (score >= cutScoreAvg + 5) {
    return '안정';
  }
  // 적정: 평균 컷 ± 2점 이내
  else if (score >= cutScoreAvg - 2 && score < cutScoreAvg + 5) {
    return '적정';
  }
  // 소신: 70% 컷과 평균 컷 사이
  else if (score >= cutScore70 - 3 && score < cutScoreAvg - 2) {
    return '소신';
  }
  // 도전: 70% 컷보다 3점 이내로 낮음
  else if (score >= cutScore70 - 6 && score < cutScore70 - 3) {
    return '도전';
  }
  // 불가능: 70% 컷보다 6점 이상 낮음
  else {
    return '불가능';
  }
}

// 합격 확률 계산
function calculateProbability(score: number, data: AdmissionData): number {
  const { cutScore70, cutScoreAvg, cutScoreTop } = data;

  // 최고 컷 이상: 95-99%
  if (score >= cutScoreTop) {
    return 95 + Math.min(5, (score - cutScoreTop) * 0.5);
  }
  // 평균 컷 이상: 70-95%
  else if (score >= cutScoreAvg) {
    const range = cutScoreTop - cutScoreAvg;
    const position = score - cutScoreAvg;
    return 70 + (position / range) * 25;
  }
  // 70% 컷 이상: 40-70%
  else if (score >= cutScore70) {
    const range = cutScoreAvg - cutScore70;
    const position = score - cutScore70;
    return 40 + (position / range) * 30;
  }
  // 70% 컷 미만: 0-40%
  else {
    const gap = cutScore70 - score;
    return Math.max(0, 40 - gap * 5);
  }
}

// 여러 대학/학과에 대한 일괄 예측
export function batchPredict(
  targets: Array<{
    universityName: string;
    departmentName: string;
    track: '인문' | '자연' | '예체능';
    convertedScore: number;
    historicalData: AdmissionData[];
  }>
): PredictionResult[] {
  return targets.map((target) =>
    predictAdmission(
      target.universityName,
      target.departmentName,
      target.track,
      target.convertedScore,
      target.historicalData
    )
  );
}

// 예측 결과를 확률 높은 순으로 정렬
export function sortByProbability(
  results: PredictionResult[]
): PredictionResult[] {
  return [...results].sort((a, b) => b.probability - a.probability);
}

// 레벨별로 결과 필터링
export function filterByLevel(
  results: PredictionResult[],
  levels: PredictionLevel[]
): PredictionResult[] {
  return results.filter((result) => levels.includes(result.level));
}

// 레벨에 따른 색상 반환 (UI용)
export function getLevelColor(level: PredictionLevel): string {
  switch (level) {
    case '안정':
      return 'text-green-600';
    case '적정':
      return 'text-blue-600';
    case '소신':
      return 'text-yellow-600';
    case '도전':
      return 'text-orange-600';
    case '불가능':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

// 레벨에 따른 배경색 반환 (UI용)
export function getLevelBgColor(level: PredictionLevel): string {
  switch (level) {
    case '안정':
      return 'bg-green-100';
    case '적정':
      return 'bg-blue-100';
    case '소신':
      return 'bg-yellow-100';
    case '도전':
      return 'bg-orange-100';
    case '불가능':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
}
