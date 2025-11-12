/**
 * 헤더 컴포넌트
 */

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleLogout = () => {
    clearAuth();
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* 로고 */}
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              대입 정시모집 합격 예측
            </h1>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.name}님 환영합니다
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  로그인
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
