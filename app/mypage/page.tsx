/**
 * 마이페이지
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/Header';

interface UserScore {
  id: string;
  koreanSubject: string | null;
  koreanStandardScore: number | null;
  koreanGrade: number | null;
  mathSubject: string | null;
  mathStandardScore: number | null;
  mathGrade: number | null;
  englishGrade: number | null;
  inquiry1Subject: string | null;
  inquiry1StandardScore: number | null;
  inquiry2Subject: string | null;
  inquiry2StandardScore: number | null;
  koreanHistoryGrade: number | null;
  createdAt: string;
}

interface PredictionWithDetails {
  id: string;
  convertedScore: number;
  predictionLevel: string;
  probability: number;
  scoreDifference: number;
  createdAt: string;
  department: {
    id: string;
    name: string;
    track: string;
    university: {
      id: string;
      name: string;
    };
  };
}

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'scores' | 'predictions' | 'settings'>('scores');
  const [scores, setScores] = useState<UserScore[]>([]);
  const [predictions, setPredictions] = useState<PredictionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 비밀번호 변경
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadData();
  }, [isAuthenticated, token, activeTab]);

  const loadData = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      if (activeTab === 'scores') {
        const response = await fetch('/api/scores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setScores(data.scores);
        }
      } else if (activeTab === 'predictions') {
        const response = await fetch('/api/predictions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPredictions(data.predictions);
        }
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScore = async (id: string) => {
    if (!confirm('이 성적을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setScores(scores.filter((s) => s.id !== id));
        alert('성적이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('성적 삭제 오류:', error);
      alert('성적 삭제에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('새 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('비밀번호가 변경되었습니다.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      setPasswordError('서버 오류가 발생했습니다.');
    }
  };

  const getPredictionLevelColor = (level: string) => {
    switch (level) {
      case '안정': return 'text-green-600 bg-green-50';
      case '적정': return 'text-blue-600 bg-blue-50';
      case '소신': return 'text-yellow-600 bg-yellow-50';
      case '도전': return 'text-orange-600 bg-orange-50';
      case '불가능': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">마이페이지</h1>

        {/* 사용자 정보 */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">사용자 정보</h2>
          <div className="space-y-2">
            <p><span className="font-medium">이름:</span> {user?.name}</p>
            <p><span className="font-medium">이메일:</span> {user?.email}</p>
            {user?.phone && <p><span className="font-medium">전화번호:</span> {user.phone}</p>}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('scores')}
            className={`rounded-lg px-6 py-3 font-medium transition ${
              activeTab === 'scores'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            저장된 성적
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`rounded-lg px-6 py-3 font-medium transition ${
              activeTab === 'predictions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            예측 히스토리
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`rounded-lg px-6 py-3 font-medium transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            설정
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="rounded-lg bg-white p-6 shadow">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">로딩 중...</div>
          ) : (
            <>
              {/* 저장된 성적 탭 */}
              {activeTab === 'scores' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">저장된 성적</h2>
                  {scores.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                      저장된 성적이 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {scores.map((score) => (
                        <div
                          key={score.id}
                          className="rounded border border-gray-200 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {new Date(score.createdAt).toLocaleString('ko-KR')}
                            </span>
                            <button
                              onClick={() => handleDeleteScore(score.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                            <div>
                              <span className="font-medium">국어:</span>{' '}
                              {score.koreanStandardScore || '-'} ({score.koreanGrade}등급)
                            </div>
                            <div>
                              <span className="font-medium">수학:</span>{' '}
                              {score.mathStandardScore || '-'} ({score.mathGrade}등급)
                            </div>
                            <div>
                              <span className="font-medium">영어:</span>{' '}
                              {score.englishGrade}등급
                            </div>
                            <div>
                              <span className="font-medium">탐구1:</span>{' '}
                              {score.inquiry1Subject} {score.inquiry1StandardScore || '-'}
                            </div>
                            <div>
                              <span className="font-medium">탐구2:</span>{' '}
                              {score.inquiry2Subject} {score.inquiry2StandardScore || '-'}
                            </div>
                            <div>
                              <span className="font-medium">한국사:</span>{' '}
                              {score.koreanHistoryGrade}등급
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 예측 히스토리 탭 */}
              {activeTab === 'predictions' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">예측 히스토리</h2>
                  {predictions.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                      예측 결과가 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {predictions.map((prediction) => (
                        <div
                          key={prediction.id}
                          className="rounded border border-gray-200 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {prediction.department.university.name}
                              </h3>
                              <p className="text-gray-600">
                                {prediction.department.name} ({prediction.department.track})
                              </p>
                            </div>
                            <span
                              className={`rounded px-3 py-1 text-sm font-semibold ${getPredictionLevelColor(
                                prediction.predictionLevel
                              )}`}
                            >
                              {prediction.predictionLevel}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                            <div>
                              <span className="font-medium">환산점수:</span>{' '}
                              {prediction.convertedScore.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">합격확률:</span>{' '}
                              {prediction.probability.toFixed(1)}%
                            </div>
                            <div>
                              <span className="font-medium">점수차:</span>{' '}
                              {prediction.scoreDifference > 0 ? '+' : ''}
                              {prediction.scoreDifference.toFixed(2)}
                            </div>
                            <div className="text-gray-500">
                              {new Date(prediction.createdAt).toLocaleDateString('ko-KR')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 설정 탭 */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">비밀번호 변경</h2>

                  {passwordError && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-red-600">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 rounded bg-green-50 p-3 text-green-600">
                      {passwordSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        required
                        className="w-full rounded border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        required
                        minLength={8}
                        className="w-full rounded border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        required
                        minLength={8}
                        className="w-full rounded border px-3 py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                    >
                      비밀번호 변경
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
