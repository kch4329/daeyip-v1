/**
 * 성적 저장/조회 API
 * GET  /api/scores - 내 성적 목록 조회
 * POST /api/scores - 성적 저장
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { extractToken, verifyToken } from '@/lib/auth';

// 성적 데이터 검증 스키마
const scoreSchema = z.object({
  // 국어
  koreanSubject: z.string().optional().nullable(),
  koreanStandardScore: z.number().int().min(0).max(200).optional().nullable(),
  koreanPercentile: z.number().int().min(0).max(100).optional().nullable(),
  koreanGrade: z.number().int().min(1).max(9).optional().nullable(),

  // 수학
  mathSubject: z.string().optional().nullable(),
  mathStandardScore: z.number().int().min(0).max(200).optional().nullable(),
  mathPercentile: z.number().int().min(0).max(100).optional().nullable(),
  mathGrade: z.number().int().min(1).max(9).optional().nullable(),

  // 영어
  englishGrade: z.number().int().min(1).max(9).optional().nullable(),

  // 탐구1
  inquiry1Subject: z.string().optional().nullable(),
  inquiry1StandardScore: z.number().int().min(0).max(100).optional().nullable(),
  inquiry1Percentile: z.number().int().min(0).max(100).optional().nullable(),
  inquiry1Grade: z.number().int().min(1).max(9).optional().nullable(),

  // 탐구2
  inquiry2Subject: z.string().optional().nullable(),
  inquiry2StandardScore: z.number().int().min(0).max(100).optional().nullable(),
  inquiry2Percentile: z.number().int().min(0).max(100).optional().nullable(),
  inquiry2Grade: z.number().int().min(1).max(9).optional().nullable(),

  // 한국사
  koreanHistoryGrade: z.number().int().min(1).max(9).optional().nullable(),

  // 제2외국어/한문
  secondLanguageGrade: z.number().int().min(1).max(9).optional().nullable(),
});

/**
 * 인증된 사용자 확인 헬퍼
 */
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return { error: '인증 토큰이 필요합니다', status: 401 };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { error: '유효하지 않은 토큰입니다', status: 401 };
  }

  return { userId: payload.userId };
}

/**
 * GET /api/scores
 * 내 성적 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 성적 목록 조회
    const scores = await prisma.userScore.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('성적 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scores
 * 성적 저장
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 데이터 검증
    const validationResult = scoreSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 성적 저장
    const score = await prisma.userScore.create({
      data: {
        userId: auth.userId,
        ...validationResult.data,
      },
    });

    return NextResponse.json(
      {
        message: '성적이 저장되었습니다',
        score,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('성적 저장 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
