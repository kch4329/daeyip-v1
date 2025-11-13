/**
 * 로그인 API
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyPassword, createToken } from '@/lib/auth';

// 요청 데이터 검증 스키마
const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();

    // 데이터 검증
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = await createToken({ userId: user.id, email: user.email });

    // 사용자 정보 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: '로그인이 완료되었습니다',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
