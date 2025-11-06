import { ConversionFormula } from '@/types';

/**
 * 년도별 대학 환산점수 계산식 데이터
 * 각 대학의 정시 입시요강에 따른 환산점수 계산 방식을 년도별로 관리
 */

// 연세대학교 환산점수 계산식 (년도별)
export const yonseiConversionFormulas: ConversionFormula[] = [
  // 2026학년도 - 인문계열
  {
    universityId: 'yonsei',
    departmentId: 'humanities',
    year: 2026,
    formula: 'standardScore', // 표준점수 사용
    weights: {
      korean: 33.3,
      math: 33.3,
      inquiry: 33.3,
      english: 0, // 등급별 감점 방식
    },
  },
  // 2026학년도 - 자연계열
  {
    universityId: 'yonsei',
    departmentId: 'science',
    year: 2026,
    formula: 'standardScore',
    weights: {
      korean: 20,
      math: 40,
      inquiry: 40,
      english: 0, // 등급별 감점 방식
    },
  },
  // 2025학년도 - 인문계열
  {
    universityId: 'yonsei',
    departmentId: 'humanities',
    year: 2025,
    formula: 'standardScore',
    weights: {
      korean: 33.3,
      math: 33.3,
      inquiry: 33.3,
      english: 0,
    },
  },
  // 2025학년도 - 자연계열
  {
    universityId: 'yonsei',
    departmentId: 'science',
    year: 2025,
    formula: 'standardScore',
    weights: {
      korean: 20,
      math: 40,
      inquiry: 40,
      english: 0,
    },
  },
  // 2024학년도 - 인문계열
  {
    universityId: 'yonsei',
    departmentId: 'humanities',
    year: 2024,
    formula: 'standardScore',
    weights: {
      korean: 33.3,
      math: 33.3,
      inquiry: 33.3,
      english: 0,
    },
  },
  // 2024학년도 - 자연계열
  {
    universityId: 'yonsei',
    departmentId: 'science',
    year: 2024,
    formula: 'standardScore',
    weights: {
      korean: 20,
      math: 40,
      inquiry: 40,
      english: 0,
    },
  },
];

// 영어 등급별 감점표 (연세대학교 기준)
export const yonseiEnglishDeduction: { [key: number]: number } = {
  1: 0,
  2: 0.5,
  3: 2,
  4: 4,
  5: 6,
  6: 8,
  7: 10,
  8: 12,
  9: 14,
};

// 한국사 등급별 감점표 (연세대학교 기준)
export const yonseiKoreanHistoryDeduction: { [key: number]: number } = {
  1: 0,
  2: 0,
  3: 0,
  4: 0.2,
  5: 0.4,
  6: 0.6,
  7: 0.8,
  8: 1.0,
  9: 1.2,
};

// 특정 년도의 환산점수 계산식 조회
export function getConversionFormula(
  universityId: string,
  track: '인문' | '자연',
  year: number
): ConversionFormula | undefined {
  const departmentId = track === '인문' ? 'humanities' : 'science';

  if (universityId === 'yonsei') {
    return yonseiConversionFormulas.find(
      (formula) =>
        formula.universityId === universityId &&
        formula.departmentId === departmentId &&
        formula.year === year
    );
  }

  return undefined;
}

// 사용 가능한 년도 목록 조회
export function getAvailableYears(universityId: string): number[] {
  if (universityId === 'yonsei') {
    return [...new Set(yonseiConversionFormulas.map((f) => f.year))].sort(
      (a, b) => b - a
    );
  }
  return [];
}

// 모든 환산점수 계산식 목록
export const allConversionFormulas = [...yonseiConversionFormulas];
