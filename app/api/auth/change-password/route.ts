/**
 * 비밀번호 변경 API
 * PUT /api/auth/change-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { extractToken, verifyToken, verifyPassword, hashPassword } from '@/lib/auth';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string().min(8, '새 비밀번호는 최소 8자 이상이어야 합니다'),
});

export async function PUT(request: NextRequest) {
  try {
    // 토큰 추출 및 검증
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱 및 검증
    const body = await request.json();
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 소셜 로그인 사용자는 비밀번호 변경 불가
    if (!user.password) {
      return NextResponse.json(
        { error: '소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다' },
        { status: 400 }
      );
    }

    // 현재 비밀번호 확인
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // 새 비밀번호 해싱
    const hashedNewPassword = await hashPassword(newPassword);

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      message: '비밀번호가 성공적으로 변경되었습니다',
    });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
