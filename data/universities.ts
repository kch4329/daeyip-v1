import { University } from '@/types';

// 주요 대학 데이터 (샘플)
export const universities: University[] = [
  {
    id: 'snu',
    name: '서울대학교',
    departments: [
      { id: 'snu-humanities', name: '인문대학', track: '인문', quota: 180 },
      { id: 'snu-social', name: '사회과학대학', track: '인문', quota: 210 },
      { id: 'snu-business', name: '경영대학', track: '인문', quota: 120 },
      { id: 'snu-engineering', name: '공과대학', track: '자연', quota: 650 },
      { id: 'snu-naturalscience', name: '자연과학대학', track: '자연', quota: 280 },
      { id: 'snu-medicine', name: '의과대학', track: '자연', quota: 135 },
    ],
  },
  {
    id: 'yonsei',
    name: '연세대학교',
    departments: [
      { id: 'yonsei-humanities', name: '문과대학', track: '인문', quota: 200 },
      { id: 'yonsei-social', name: '사회과학대학', track: '인문', quota: 250 },
      { id: 'yonsei-business', name: '경영대학', track: '인문', quota: 180 },
      { id: 'yonsei-engineering', name: '공과대학', track: '자연', quota: 600 },
      { id: 'yonsei-science', name: '이과대학', track: '자연', quota: 300 },
      { id: 'yonsei-medicine', name: '의과대학', track: '자연', quota: 120 },
    ],
  },
  {
    id: 'korea',
    name: '고려대학교',
    departments: [
      { id: 'korea-humanities', name: '문과대학', track: '인문', quota: 220 },
      { id: 'korea-political', name: '정경대학', track: '인문', quota: 280 },
      { id: 'korea-business', name: '경영대학', track: '인문', quota: 200 },
      { id: 'korea-engineering', name: '공과대학', track: '자연', quota: 620 },
      { id: 'korea-science', name: '이과대학', track: '자연', quota: 320 },
      { id: 'korea-medicine', name: '의과대학', track: '자연', quota: 100 },
    ],
  },
  {
    id: 'kaist',
    name: 'KAIST',
    departments: [
      { id: 'kaist-engineering', name: '공과대학', track: '자연', quota: 400 },
      { id: 'kaist-naturalscience', name: '자연과학대학', track: '자연', quota: 250 },
      { id: 'kaist-business', name: '경영대학', track: '자연', quota: 100 },
    ],
  },
  {
    id: 'skku',
    name: '성균관대학교',
    departments: [
      { id: 'skku-humanities', name: '유학대학', track: '인문', quota: 150 },
      { id: 'skku-social', name: '사회과학대학', track: '인문', quota: 200 },
      { id: 'skku-business', name: '경영대학', track: '인문', quota: 180 },
      { id: 'skku-engineering', name: '공과대학', track: '자연', quota: 550 },
      { id: 'skku-science', name: '자연과학대학', track: '자연', quota: 280 },
      { id: 'skku-medicine', name: '의과대학', track: '자연', quota: 40 },
    ],
  },
  {
    id: 'hanyang',
    name: '한양대학교',
    departments: [
      { id: 'hanyang-humanities', name: '인문과학대학', track: '인문', quota: 180 },
      { id: 'hanyang-social', name: '사회과학대학', track: '인문', quota: 220 },
      { id: 'hanyang-business', name: '경상대학', track: '인문', quota: 200 },
      { id: 'hanyang-engineering', name: '공과대학', track: '자연', quota: 700 },
      { id: 'hanyang-science', name: '자연과학대학', track: '자연', quota: 300 },
      { id: 'hanyang-medicine', name: '의과대학', track: '자연', quota: 80 },
    ],
  },
];

// 대학 ID로 대학 찾기
export function getUniversityById(id: string): University | undefined {
  return universities.find((uni) => uni.id === id);
}

// 학과 ID로 학과 찾기
export function getDepartmentById(
  universityId: string,
  departmentId: string
): { university: University; department: any } | undefined {
  const university = getUniversityById(universityId);
  if (!university) return undefined;

  const department = university.departments.find((dept) => dept.id === departmentId);
  if (!department) return undefined;

  return { university, department };
}
