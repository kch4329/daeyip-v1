// 수능 성적 관련 타입

// 국어 선택과목
export type KoreanSubject = '화법과작문' | '언어와매체';

// 수학 선택과목
export type MathSubject = '확률과통계' | '미적분' | '기하';

// 탐구 과목 (사회/과학)
export type InquirySubject =
  // 사회탐구
  | '생활과윤리' | '윤리와사상' | '한국지리' | '세계지리'
  | '동아시아사' | '세계사' | '경제' | '정치와법' | '사회문화'
  // 과학탐구
  | '물리학Ⅰ' | '물리학Ⅱ' | '화학Ⅰ' | '화학Ⅱ'
  | '생명과학Ⅰ' | '생명과학Ⅱ' | '지구과학Ⅰ' | '지구과학Ⅱ';

// 일반 과목 성적 (표준점수, 백분위, 등급 포함)
export interface SubjectScore {
  selectedSubject: string | null; // 선택과목
  standardScore: number | null; // 표준점수
  percentile: number | null; // 백분위
  grade: number | null; // 등급 (1-9)
}

// 절대평가 과목 성적 (등급만)
export interface AbsoluteScore {
  grade: number | null; // 등급 (1-9)
}

export interface ExamScores {
  korean: SubjectScore; // 국어 (선택과목 포함)
  math: SubjectScore; // 수학 (선택과목 포함)
  english: AbsoluteScore; // 영어 (절대평가)
  koreanHistory: AbsoluteScore; // 한국사 (절대평가)
  inquiry1: SubjectScore; // 탐구 1 (선택과목 포함)
  inquiry2: SubjectScore; // 탐구 2 (선택과목 포함)
  secondLanguage?: AbsoluteScore; // 제2외국어/한문 (선택, 절대평가)
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
