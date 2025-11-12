/**
 * 예측 결과 저장/조회 API
 * GET  /api/predictions - 내 예측 결과 목록 조회
 * POST /api/predictions - 예측 결과 저장
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { extractToken, verifyToken } from '@/lib/auth';

// 예측 결과 데이터 검증 스키마
const predictionSchema = z.object({
  userScoreId: z.string().uuid('올바른 성적 ID가 아닙니다'),
  departmentId: z.string().min(1, '모집단위 ID가 필요합니다'),
  convertedScore: z.number().min(0, '환산점수는 0 이상이어야 합니다'),
  predictionLevel: z.enum(['안정', '적정', '소신', '도전', '불가능']),
  probability: z.number().min(0).max(100, '합격 확률은 0-100 사이여야 합니다'),
  scoreDifference: z.number(),
});

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
 * GET /api/predictions
 * 내 예측 결과 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // URL 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 필터 조건 구성
    const where: any = { userId: auth.userId };
    if (departmentId) {
      where.departmentId = departmentId;
    }

    // 예측 결과 조회 (모집단위 및 성적 정보 포함)
    const predictions = await prisma.userPrediction.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        department: {
          include: {
            university: true,
          },
        },
        userScore: true,
      },
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('예측 결과 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/predictions
 * 예측 결과 저장
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 데이터 검증
    const validationResult = predictionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { userScoreId, departmentId, ...data } = validationResult.data;

    // 성적이 본인 것인지 확인
    const userScore = await prisma.userScore.findUnique({
      where: { id: userScoreId },
    });

    if (!userScore || userScore.userId !== auth.userId) {
      return NextResponse.json(
        { error: '성적을 찾을 수 없거나 접근 권한이 없습니다' },
        { status: 403 }
      );
    }

    // 모집단위 존재 확인
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: '모집단위를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 예측 결과 저장
    const prediction = await prisma.userPrediction.create({
      data: {
        userId: auth.userId,
        userScoreId,
        departmentId,
        ...data,
      },
      include: {
        department: {
          include: {
            university: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: '예측 결과가 저장되었습니다',
        prediction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('예측 결과 저장 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
