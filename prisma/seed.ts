import { PrismaClient } from '@prisma/client';
import { admissionData } from '../data/admissionData';
import { universities } from '../data/universities';
import { yonseiConversionFormulas, yonseiEnglishDeduction, yonseiKoreanHistoryDeduction } from '../data/conversionFormulas';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...\n');

  // 1. 대학 데이터 삽입
  console.log('📚 대학 데이터 삽입 중...');
  for (const university of universities) {
    await prisma.university.upsert({
      where: { id: university.id },
      update: { name: university.name },
      create: {
        id: university.id,
        name: university.name,
      },
    });
    console.log(`  ✓ ${university.name}`);
  }
  console.log('');

  // 2. 모집단위 데이터 삽입
  console.log('🎓 모집단위 데이터 삽입 중...');
  for (const university of universities) {
    for (const department of university.departments) {
      await prisma.department.upsert({
        where: { id: department.id },
        update: {
          name: department.name,
          track: department.track,
          quota: department.quota,
        },
        create: {
          id: department.id,
          universityId: university.id,
          name: department.name,
          track: department.track,
          quota: department.quota,
        },
      });
      console.log(`  ✓ ${university.name} - ${department.name}`);
    }
  }
  console.log('');

  // 3. 입시 결과 데이터 삽입
  console.log('📊 입시 결과 데이터 삽입 중...');
  for (const data of admissionData) {
    // department가 존재하는지 확인
    const departmentExists = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });

    if (!departmentExists) {
      console.log(`  ⚠ 경고: 모집단위를 찾을 수 없습니다 - ${data.departmentId}`);
      continue;
    }

    await prisma.admissionResult.upsert({
      where: {
        departmentId_year: {
          departmentId: data.departmentId,
          year: data.year,
        },
      },
      update: {
        cutScore70: data.cutScore70,
        cutScoreAvg: data.cutScoreAvg,
        cutScoreTop: data.cutScoreTop,
        applicants: data.applicants,
        admitted: data.admitted,
        competition: data.competition,
      },
      create: {
        departmentId: data.departmentId,
        year: data.year,
        cutScore70: data.cutScore70,
        cutScoreAvg: data.cutScoreAvg,
        cutScoreTop: data.cutScoreTop,
        applicants: data.applicants,
        admitted: data.admitted,
        competition: data.competition,
      },
    });
  }
  console.log(`  ✓ ${admissionData.length}개의 입시 결과 데이터 삽입 완료`);
  console.log('');

  // 4. 환산점수 계산식 데이터 삽입
  console.log('🧮 환산점수 계산식 데이터 삽입 중...');

  // 연세대학교 환산점수 계산식
  for (const formula of yonseiConversionFormulas) {
    await prisma.conversionFormula.upsert({
      where: {
        universityId_departmentId_year_track: {
          universityId: formula.universityId,
          departmentId: formula.departmentId,
          year: formula.year,
          track: formula.departmentId === 'humanities' ? '인문' : '자연',
        },
      },
      update: {
        formulaType: formula.formula,
        koreanWeight: formula.weights.korean ?? null,
        mathWeight: formula.weights.math ?? null,
        inquiryWeight: formula.weights.inquiry ?? null,
        englishWeight: formula.weights.english ?? null,
        koreanHistoryWeight: null,
        secondLanguageWeight: null,
        englishDeductions: yonseiEnglishDeduction as any,
        koreanHistoryDeductions: yonseiKoreanHistoryDeduction as any,
        description: `${formula.year}학년도 연세대학교 ${formula.departmentId === 'humanities' ? '인문계열' : '자연계열'} 환산점수 계산식`,
      },
      create: {
        universityId: formula.universityId,
        departmentId: formula.departmentId,
        year: formula.year,
        track: formula.departmentId === 'humanities' ? '인문' : '자연',
        formulaType: formula.formula,
        koreanWeight: formula.weights.korean ?? null,
        mathWeight: formula.weights.math ?? null,
        inquiryWeight: formula.weights.inquiry ?? null,
        englishWeight: formula.weights.english ?? null,
        koreanHistoryWeight: null,
        secondLanguageWeight: null,
        englishDeductions: yonseiEnglishDeduction as any,
        koreanHistoryDeductions: yonseiKoreanHistoryDeduction as any,
        description: `${formula.year}학년도 연세대학교 ${formula.departmentId === 'humanities' ? '인문계열' : '자연계열'} 환산점수 계산식`,
      },
    });
  }
  console.log(`  ✓ ${yonseiConversionFormulas.length}개의 환산점수 계산식 데이터 삽입 완료`);
  console.log('');

  console.log('✅ 데이터베이스 시딩 완료!\n');

  // 통계 출력
  const universityCount = await prisma.university.count();
  const departmentCount = await prisma.department.count();
  const admissionResultCount = await prisma.admissionResult.count();
  const conversionFormulaCount = await prisma.conversionFormula.count();

  console.log('📈 시딩 통계:');
  console.log(`  • 대학: ${universityCount}개`);
  console.log(`  • 모집단위: ${departmentCount}개`);
  console.log(`  • 입시 결과: ${admissionResultCount}개`);
  console.log(`  • 환산점수 계산식: ${conversionFormulaCount}개`);
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 시딩 중 오류 발생:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
