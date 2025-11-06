import { AdmissionData } from '@/types';

// 과거 3개년도 입시 데이터 (샘플 - 실제로는 DB에서 가져와야 함)
export const admissionData: AdmissionData[] = [
  // 서울대학교 - 인문대학
  { universityId: 'snu', departmentId: 'snu-humanities', year: 2024, cutScore70: 688.5, cutScoreAvg: 692.3, cutScoreTop: 698.2, applicants: 540, admitted: 180, competition: 3.0 },
  { universityId: 'snu', departmentId: 'snu-humanities', year: 2023, cutScore70: 685.2, cutScoreAvg: 689.8, cutScoreTop: 695.5, applicants: 520, admitted: 180, competition: 2.89 },
  { universityId: 'snu', departmentId: 'snu-humanities', year: 2022, cutScore70: 682.8, cutScoreAvg: 687.2, cutScoreTop: 693.1, applicants: 510, admitted: 180, competition: 2.83 },

  // 서울대학교 - 공과대학
  { universityId: 'snu', departmentId: 'snu-engineering', year: 2024, cutScore70: 692.8, cutScoreAvg: 696.5, cutScoreTop: 702.3, applicants: 1950, admitted: 650, competition: 3.0 },
  { universityId: 'snu', departmentId: 'snu-engineering', year: 2023, cutScore70: 689.5, cutScoreAvg: 693.2, cutScoreTop: 699.1, applicants: 1900, admitted: 650, competition: 2.92 },
  { universityId: 'snu', departmentId: 'snu-engineering', year: 2022, cutScore70: 686.3, cutScoreAvg: 690.1, cutScoreTop: 696.2, applicants: 1850, admitted: 650, competition: 2.85 },

  // 서울대학교 - 의과대학
  { universityId: 'snu', departmentId: 'snu-medicine', year: 2024, cutScore70: 698.5, cutScoreAvg: 701.2, cutScoreTop: 705.8, applicants: 810, admitted: 135, competition: 6.0 },
  { universityId: 'snu', departmentId: 'snu-medicine', year: 2023, cutScore70: 695.8, cutScoreAvg: 698.9, cutScoreTop: 703.2, applicants: 795, admitted: 135, competition: 5.89 },
  { universityId: 'snu', departmentId: 'snu-medicine', year: 2022, cutScore70: 693.2, cutScoreAvg: 696.5, cutScoreTop: 700.8, applicants: 780, admitted: 135, competition: 5.78 },

  // 연세대학교 - 문과대학
  { universityId: 'yonsei', departmentId: 'yonsei-humanities', year: 2026, cutScore70: 683.5, cutScoreAvg: 688.2, cutScoreTop: 693.8, applicants: 620, admitted: 200, competition: 3.1 },
  { universityId: 'yonsei', departmentId: 'yonsei-humanities', year: 2025, cutScore70: 680.2, cutScoreAvg: 685.1, cutScoreTop: 690.5, applicants: 600, admitted: 200, competition: 3.0 },
  { universityId: 'yonsei', departmentId: 'yonsei-humanities', year: 2024, cutScore70: 677.1, cutScoreAvg: 682.3, cutScoreTop: 687.8, applicants: 580, admitted: 200, competition: 2.9 },

  // 연세대학교 - 사회과학대학
  { universityId: 'yonsei', departmentId: 'yonsei-social', year: 2026, cutScore70: 685.8, cutScoreAvg: 690.5, cutScoreTop: 696.2, applicants: 800, admitted: 250, competition: 3.2 },
  { universityId: 'yonsei', departmentId: 'yonsei-social', year: 2025, cutScore70: 682.5, cutScoreAvg: 687.2, cutScoreTop: 693.1, applicants: 775, admitted: 250, competition: 3.1 },
  { universityId: 'yonsei', departmentId: 'yonsei-social', year: 2024, cutScore70: 679.3, cutScoreAvg: 684.1, cutScoreTop: 689.8, applicants: 750, admitted: 250, competition: 3.0 },

  // 연세대학교 - 경영대학
  { universityId: 'yonsei', departmentId: 'yonsei-business', year: 2026, cutScore70: 688.5, cutScoreAvg: 693.2, cutScoreTop: 698.8, applicants: 760, admitted: 180, competition: 4.22 },
  { universityId: 'yonsei', departmentId: 'yonsei-business', year: 2025, cutScore70: 685.2, cutScoreAvg: 689.8, cutScoreTop: 695.5, applicants: 740, admitted: 180, competition: 4.11 },
  { universityId: 'yonsei', departmentId: 'yonsei-business', year: 2024, cutScore70: 682.3, cutScoreAvg: 686.8, cutScoreTop: 692.5, applicants: 720, admitted: 180, competition: 4.0 },
  { universityId: 'yonsei', departmentId: 'yonsei-business', year: 2023, cutScore70: 679.5, cutScoreAvg: 684.2, cutScoreTop: 689.8, applicants: 700, admitted: 180, competition: 3.89 },
  { universityId: 'yonsei', departmentId: 'yonsei-business', year: 2022, cutScore70: 676.8, cutScoreAvg: 681.5, cutScoreTop: 687.2, applicants: 680, admitted: 180, competition: 3.78 },

  // 연세대학교 - 공과대학
  { universityId: 'yonsei', departmentId: 'yonsei-engineering', year: 2026, cutScore70: 691.5, cutScoreAvg: 695.8, cutScoreTop: 701.5, applicants: 1900, admitted: 600, competition: 3.17 },
  { universityId: 'yonsei', departmentId: 'yonsei-engineering', year: 2025, cutScore70: 688.2, cutScoreAvg: 692.5, cutScoreTop: 698.2, applicants: 1850, admitted: 600, competition: 3.08 },
  { universityId: 'yonsei', departmentId: 'yonsei-engineering', year: 2024, cutScore70: 685.2, cutScoreAvg: 689.3, cutScoreTop: 695.1, applicants: 1800, admitted: 600, competition: 3.0 },
  { universityId: 'yonsei', departmentId: 'yonsei-engineering', year: 2023, cutScore70: 682.5, cutScoreAvg: 686.8, cutScoreTop: 692.3, applicants: 1750, admitted: 600, competition: 2.92 },
  { universityId: 'yonsei', departmentId: 'yonsei-engineering', year: 2022, cutScore70: 679.8, cutScoreAvg: 684.2, cutScoreTop: 689.8, applicants: 1700, admitted: 600, competition: 2.83 },

  // 연세대학교 - 이과대학
  { universityId: 'yonsei', departmentId: 'yonsei-science', year: 2026, cutScore70: 687.5, cutScoreAvg: 692.1, cutScoreTop: 697.8, applicants: 930, admitted: 300, competition: 3.1 },
  { universityId: 'yonsei', departmentId: 'yonsei-science', year: 2025, cutScore70: 684.2, cutScoreAvg: 689.1, cutScoreTop: 694.5, applicants: 900, admitted: 300, competition: 3.0 },
  { universityId: 'yonsei', departmentId: 'yonsei-science', year: 2024, cutScore70: 681.3, cutScoreAvg: 686.2, cutScoreTop: 691.8, applicants: 870, admitted: 300, competition: 2.9 },

  // 연세대학교 - 의과대학
  { universityId: 'yonsei', departmentId: 'yonsei-medicine', year: 2026, cutScore70: 702.8, cutScoreAvg: 705.8, cutScoreTop: 710.5, applicants: 780, admitted: 120, competition: 6.5 },
  { universityId: 'yonsei', departmentId: 'yonsei-medicine', year: 2025, cutScore70: 699.8, cutScoreAvg: 702.5, cutScoreTop: 707.2, applicants: 750, admitted: 120, competition: 6.25 },
  { universityId: 'yonsei', departmentId: 'yonsei-medicine', year: 2024, cutScore70: 696.8, cutScoreAvg: 699.5, cutScoreTop: 704.2, applicants: 720, admitted: 120, competition: 6.0 },
  { universityId: 'yonsei', departmentId: 'yonsei-medicine', year: 2023, cutScore70: 694.2, cutScoreAvg: 697.1, cutScoreTop: 701.5, applicants: 700, admitted: 120, competition: 5.83 },
  { universityId: 'yonsei', departmentId: 'yonsei-medicine', year: 2022, cutScore70: 691.5, cutScoreAvg: 694.8, cutScoreTop: 699.2, applicants: 680, admitted: 120, competition: 5.67 },

  // 고려대학교 - 경영대학
  { universityId: 'korea', departmentId: 'korea-business', year: 2024, cutScore70: 680.5, cutScoreAvg: 685.2, cutScoreTop: 690.8, applicants: 800, admitted: 200, competition: 4.0 },
  { universityId: 'korea', departmentId: 'korea-business', year: 2023, cutScore70: 677.8, cutScoreAvg: 682.5, cutScoreTop: 688.2, applicants: 780, admitted: 200, competition: 3.9 },
  { universityId: 'korea', departmentId: 'korea-business', year: 2022, cutScore70: 675.2, cutScoreAvg: 679.8, cutScoreTop: 685.5, applicants: 760, admitted: 200, competition: 3.8 },

  // 고려대학교 - 공과대학
  { universityId: 'korea', departmentId: 'korea-engineering', year: 2024, cutScore70: 683.5, cutScoreAvg: 687.8, cutScoreTop: 693.2, applicants: 1860, admitted: 620, competition: 3.0 },
  { universityId: 'korea', departmentId: 'korea-engineering', year: 2023, cutScore70: 680.8, cutScoreAvg: 685.2, cutScoreTop: 690.5, applicants: 1800, admitted: 620, competition: 2.9 },
  { universityId: 'korea', departmentId: 'korea-engineering', year: 2022, cutScore70: 678.2, cutScoreAvg: 682.5, cutScoreTop: 687.8, applicants: 1750, admitted: 620, competition: 2.82 },

  // 고려대학교 - 의과대학
  { universityId: 'korea', departmentId: 'korea-medicine', year: 2024, cutScore70: 695.2, cutScoreAvg: 698.5, cutScoreTop: 703.1, applicants: 600, admitted: 100, competition: 6.0 },
  { universityId: 'korea', departmentId: 'korea-medicine', year: 2023, cutScore70: 692.5, cutScoreAvg: 696.1, cutScoreTop: 700.5, applicants: 580, admitted: 100, competition: 5.8 },
  { universityId: 'korea', departmentId: 'korea-medicine', year: 2022, cutScore70: 689.8, cutScoreAvg: 693.8, cutScoreTop: 698.2, applicants: 560, admitted: 100, competition: 5.6 },

  // KAIST - 공과대학
  { universityId: 'kaist', departmentId: 'kaist-engineering', year: 2024, cutScore70: 690.5, cutScoreAvg: 694.2, cutScoreTop: 699.8, applicants: 1200, admitted: 400, competition: 3.0 },
  { universityId: 'kaist', departmentId: 'kaist-engineering', year: 2023, cutScore70: 687.8, cutScoreAvg: 691.5, cutScoreTop: 697.2, applicants: 1150, admitted: 400, competition: 2.88 },
  { universityId: 'kaist', departmentId: 'kaist-engineering', year: 2022, cutScore70: 685.2, cutScoreAvg: 689.1, cutScoreTop: 694.5, applicants: 1100, admitted: 400, competition: 2.75 },

  // 성균관대학교 - 경영대학
  { universityId: 'skku', departmentId: 'skku-business', year: 2024, cutScore70: 675.8, cutScoreAvg: 680.5, cutScoreTop: 686.2, applicants: 720, admitted: 180, competition: 4.0 },
  { universityId: 'skku', departmentId: 'skku-business', year: 2023, cutScore70: 673.2, cutScoreAvg: 678.1, cutScoreTop: 683.5, applicants: 700, admitted: 180, competition: 3.89 },
  { universityId: 'skku', departmentId: 'skku-business', year: 2022, cutScore70: 670.5, cutScoreAvg: 675.8, cutScoreTop: 681.2, applicants: 680, admitted: 180, competition: 3.78 },

  // 한양대학교 - 공과대학
  { universityId: 'hanyang', departmentId: 'hanyang-engineering', year: 2024, cutScore70: 678.5, cutScoreAvg: 683.2, cutScoreTop: 689.1, applicants: 2100, admitted: 700, competition: 3.0 },
  { universityId: 'hanyang', departmentId: 'hanyang-engineering', year: 2023, cutScore70: 675.8, cutScoreAvg: 680.8, cutScoreTop: 686.5, applicants: 2050, admitted: 700, competition: 2.93 },
  { universityId: 'hanyang', departmentId: 'hanyang-engineering', year: 2022, cutScore70: 673.2, cutScoreAvg: 678.5, cutScoreTop: 684.2, applicants: 2000, admitted: 700, competition: 2.86 },
];

// 특정 대학/학과의 과거 데이터 조회
export function getAdmissionDataByDepartment(
  universityId: string,
  departmentId: string
): AdmissionData[] {
  return admissionData
    .filter((data) => data.universityId === universityId && data.departmentId === departmentId)
    .sort((a, b) => b.year - a.year); // 최신 연도부터
}

// 최신 연도의 커트라인 조회
export function getLatestCutScore(
  universityId: string,
  departmentId: string
): AdmissionData | undefined {
  const data = getAdmissionDataByDepartment(universityId, departmentId);
  return data[0]; // 가장 최근 데이터
}
