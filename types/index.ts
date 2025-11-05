// 수능 성적 관련 타입
export interface SubjectScore {
  standardScore: number | null; // 표준점수
  percentile: number | null; // 백분위
  grade: number | null; // 등급 (1-9)
}

export interface ExamScores {
  korean: SubjectScore; // 국어
  math: SubjectScore; // 수학
  english: SubjectScore; // 영어
  koreanHistory: SubjectScore; // 한국사
  inquiry1: SubjectScore; // 탐구 1
  inquiry2: SubjectScore; // 탐구 2
  secondLanguage?: SubjectScore; // 제2외국어/한문 (선택)
}

// 대학 및 모집단위 관련 타입
export type Track = '인문' | '자연' | '예체능';

export interface Department {
  id: string;
  name: string; // 모집단위명
  track: Track; // 계열
  quota: number; // 모집인원
}

export interface University {
  id: string;
  name: string; // 대학명
  departments: Department[];
}

// 환산점수 공식 관련 타입
export interface ConversionFormula {
  universityId: string;
  departmentId: string;
  year: number;
  formula: string; // 환산점수 계산 공식 (JSON 문자열)
  weights: {
    korean?: number;
    math?: number;
    english?: number;
    inquiry?: number;
    koreanHistory?: number;
    secondLanguage?: number;
  };
}

// 합격 데이터 관련 타입
export interface AdmissionData {
  universityId: string;
  departmentId: string;
  year: number;
  cutScore70: number; // 70% 컷
  cutScoreAvg: number; // 평균 컷
  cutScoreTop: number; // 최고 컷
  applicants: number; // 지원자 수
  admitted: number; // 합격자 수
  competition: number; // 경쟁률
}

// 합격 예측 결과 타입
export type PredictionLevel = '안정' | '적정' | '소신' | '도전' | '불가능';

export interface PredictionResult {
  universityName: string;
  departmentName: string;
  track: Track;
  convertedScore: number; // 환산점수
  cutScore70: number;
  cutScoreAvg: number;
  level: PredictionLevel;
  probability: number; // 합격 가능성 (0-100)
  scoreDifference: number; // 평균 컷과의 점수 차이
  yearlyData: AdmissionData[]; // 최근 3-4년 데이터
}

// OCR 결과 타입
export interface OCRResult {
  success: boolean;
  scores?: ExamScores;
  error?: string;
}

// 폼 입력 상태 타입
export interface PredictionFormData {
  scores: ExamScores;
  selectedUniversity: string | null;
  selectedTrack: Track | null;
  selectedDepartment: string | null;
}
