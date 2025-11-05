import { ExamScores } from '@/types';

/**
 * 대학별 환산점수 계산 엔진
 * 실제로는 각 대학의 복잡한 환산점수 공식을 적용해야 하지만,
 * 여기서는 간소화된 예시를 사용합니다.
 */

// 기본 환산점수 계산 (표준점수 기반)
export function calculateBasicConvertedScore(scores: ExamScores): number {
  const korean = scores.korean.standardScore || 0;
  const math = scores.math.standardScore || 0;
  const english = convertEnglishGradeToScore(scores.english.grade || 9);
  const inquiry1 = scores.inquiry1.standardScore || 0;
  const inquiry2 = scores.inquiry2.standardScore || 0;

  // 기본 공식: 국어(30%) + 수학(35%) + 영어(20%) + 탐구(15%)
  const convertedScore =
    korean * 0.30 +
    math * 0.35 +
    english * 0.20 +
    ((inquiry1 + inquiry2) / 2) * 0.15;

  return Math.round(convertedScore * 10) / 10;
}

// 인문계열 환산점수 계산
export function calculateHumanitiesScore(scores: ExamScores): number {
  const korean = scores.korean.standardScore || 0;
  const math = scores.math.standardScore || 0;
  const english = convertEnglishGradeToScore(scores.english.grade || 9);
  const inquiry1 = scores.inquiry1.standardScore || 0;
  const inquiry2 = scores.inquiry2.standardScore || 0;

  // 인문: 국어(35%) + 수학(30%) + 영어(20%) + 탐구(15%)
  const convertedScore =
    korean * 0.35 +
    math * 0.30 +
    english * 0.20 +
    ((inquiry1 + inquiry2) / 2) * 0.15;

  return Math.round(convertedScore * 10) / 10;
}

// 자연계열 환산점수 계산
export function calculateScienceScore(scores: ExamScores): number {
  const korean = scores.korean.standardScore || 0;
  const math = scores.math.standardScore || 0;
  const english = convertEnglishGradeToScore(scores.english.grade || 9);
  const inquiry1 = scores.inquiry1.standardScore || 0;
  const inquiry2 = scores.inquiry2.standardScore || 0;

  // 자연: 국어(25%) + 수학(40%) + 영어(20%) + 탐구(15%)
  const convertedScore =
    korean * 0.25 +
    math * 0.40 +
    english * 0.20 +
    ((inquiry1 + inquiry2) / 2) / 0.15;

  return Math.round(convertedScore * 10) / 10;
}

// 영어 등급을 표준점수로 변환 (간소화된 버전)
export function convertEnglishGradeToScore(grade: number): number {
  const scoreMap: { [key: number]: number } = {
    1: 100,
    2: 95,
    3: 87,
    4: 75,
    5: 60,
    6: 40,
    7: 20,
    8: 10,
    9: 5,
  };
  return scoreMap[grade] || 0;
}

// 대학별 환산점수 계산 (실제로는 더 복잡한 로직 필요)
export function calculateUniversityScore(
  universityId: string,
  departmentId: string,
  scores: ExamScores
): number {
  // 실제로는 각 대학의 환산점수 공식을 DB에서 가져와서 적용해야 함
  // 여기서는 간단한 예시로 처리

  // 계열에 따라 다른 계산 방식 적용
  if (departmentId.includes('humanities') ||
      departmentId.includes('social') ||
      departmentId.includes('business') ||
      departmentId.includes('political')) {
    return calculateHumanitiesScore(scores);
  } else {
    return calculateScienceScore(scores);
  }
}

// 백분위 기반 환산점수 계산
export function calculatePercentileBasedScore(scores: ExamScores): number {
  const korean = scores.korean.percentile || 0;
  const math = scores.math.percentile || 0;
  const english = scores.english.percentile || 0;
  const inquiry1 = scores.inquiry1.percentile || 0;
  const inquiry2 = scores.inquiry2.percentile || 0;

  const convertedScore =
    korean * 0.30 +
    math * 0.35 +
    english * 0.20 +
    ((inquiry1 + inquiry2) / 2) * 0.15;

  return Math.round(convertedScore * 10) / 10;
}

// 점수 유효성 검증
export function validateScores(scores: ExamScores): boolean {
  const subjects = [
    scores.korean,
    scores.math,
    scores.english,
    scores.inquiry1,
    scores.inquiry2,
  ];

  // 최소한 필수 과목의 점수가 입력되어 있는지 확인
  return subjects.every(subject =>
    subject.standardScore !== null ||
    subject.percentile !== null ||
    subject.grade !== null
  );
}
