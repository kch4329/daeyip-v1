/**
 * 특정 성적 조회/수정/삭제 API
 * GET    /api/scores/[id] - 특정 성적 조회
 * PUT    /api/scores/[id] - 성적 수정
 * DELETE /api/scores/[id] - 성적 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { extractToken, verifyToken } from '@/lib/auth';

// 성적 데이터 검증 스키마 (PUT용)
const updateScoreSchema = z.object({
  koreanSubject: z.string().optional().nullable(),
  koreanStandardScore: z.number().int().min(0).max(200).optional().nullable(),
  koreanPercentile: z.number().int().min(0).max(100).optional().nullable(),
  koreanGrade: z.number().int().min(1).max(9).optional().nullable(),
  mathSubject: z.string().optional().nullable(),
  mathStandardScore: z.number().int().min(0).max(200).optional().nullable(),
  mathPercentile: z.number().int().min(0).max(100).optional().nullable(),
  mathGrade: z.number().int().min(1).max(9).optional().nullable(),
  englishGrade: z.number().int().min(1).max(9).optional().nullable(),
  inquiry1Subject: z.string().optional().nullable(),
  inquiry1StandardScore: z.number().int().min(0).max(100).optional().nullable(),
  inquiry1Percentile: z.number().int().min(0).max(100).optional().nullable(),
  inquiry1Grade: z.number().int().min(1).max(9).optional().nullable(),
  inquiry2Subject: z.string().optional().nullable(),
  inquiry2StandardScore: z.number().int().min(0).max(100).optional().nullable(),
  inquiry2Percentile: z.number().int().min(0).max(100).optional().nullable(),
  inquiry2Grade: z.number().int().min(1).max(9).optional().nullable(),
  koreanHistoryGrade: z.number().int().min(1).max(9).optional().nullable(),
  secondLanguageGrade: z.number().int().min(1).max(9).optional().nullable(),
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
 * GET /api/scores/[id]
 * 특정 성적 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const score = await prisma.userScore.findUnique({
      where: { id: params.id },
    });

    if (!score) {
      return NextResponse.json(
        { error: '성적을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 본인의 성적인지 확인
    if (score.userId !== auth.userId) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다' },
        { status: 403 }
      );
    }

    return NextResponse.json({ score });
  } catch (error) {
    console.error('성적 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/scores/[id]
 * 성적 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 기존 성적 확인
    const existingScore = await prisma.userScore.findUnique({
      where: { id: params.id },
    });

    if (!existingScore) {
      return NextResponse.json(
        { error: '성적을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 본인의 성적인지 확인
    if (existingScore.userId !== auth.userId) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다' },
        { status: 403 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 데이터 검증
    const validationResult = updateScoreSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 성적 수정
    const updatedScore = await prisma.userScore.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return NextResponse.json({
      message: '성적이 수정되었습니다',
      score: updatedScore,
    });
  } catch (error) {
    console.error('성적 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/scores/[id]
 * 성적 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 기존 성적 확인
    const existingScore = await prisma.userScore.findUnique({
      where: { id: params.id },
    });

    if (!existingScore) {
      return NextResponse.json(
        { error: '성적을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 본인의 성적인지 확인
    if (existingScore.userId !== auth.userId) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다' },
        { status: 403 }
      );
    }

    // 성적 삭제
    await prisma.userScore.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: '성적이 삭제되었습니다',
    });
  } catch (error) {
    console.error('성적 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
