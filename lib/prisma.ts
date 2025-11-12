/**
 * Prisma Client 인스턴스
 *
 * Next.js의 Hot Reload 시 여러 개의 Prisma Client 인스턴스가 생성되는 것을 방지하기 위해
 * globalThis를 사용하여 싱글톤 패턴으로 관리합니다.
 */

import { PrismaClient } from '@prisma/client';

// PrismaClient를 전역 변수로 선언
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma Client 인스턴스 생성 (싱글톤)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 개발 환경에서는 전역 변수에 저장하여 Hot Reload 시에도 재사용
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
