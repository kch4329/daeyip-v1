'use client';

import React from 'react';
import { PredictionResult } from '@/types';
import { getLevelColor, getLevelBgColor } from '@/lib/predictionEngine';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface PredictionResultProps {
  result: PredictionResult;
}

export default function PredictionResultComponent({ result }: PredictionResultProps) {
  // 과거 3개년도 데이터 차트용 데이터
  const yearlyChartData = result.yearlyData.map((data) => ({
    년도: `${data.year}년`,
    '70%컷': data.cutScore70,
    평균컷: data.cutScoreAvg,
    최고컷: data.cutScoreTop,
    '내 점수': result.convertedScore,
  }));

  // 합격 확률 게이지 데이터
  const probabilityGaugeData = [
    { name: '불합격', value: 100 - result.probability, fill: '#EF4444' },
    { name: '합격', value: result.probability, fill: '#10B981' },
  ];

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 합격 예측 결과
        </h2>
        <p className="text-gray-600">
          {result.universityName} {result.departmentName} ({result.track})
        </p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* 환산점수 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">환산점수</p>
          <p className="text-2xl font-bold text-blue-700">
            {result.convertedScore.toFixed(1)}
          </p>
        </div>

        {/* 평균컷 */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">평균컷 (2024)</p>
          <p className="text-2xl font-bold text-purple-700">
            {result.cutScoreAvg.toFixed(1)}
          </p>
        </div>

        {/* 점수 차이 */}
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">평균컷과의 차이</p>
          <p
            className={`text-2xl font-bold ${
              result.scoreDifference >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {result.scoreDifference >= 0 ? '+' : ''}
            {result.scoreDifference.toFixed(1)}
          </p>
        </div>

        {/* 합격 확률 */}
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">합격 확률</p>
          <p className="text-2xl font-bold text-indigo-700">
            {result.probability.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 합격 가능성 레벨 */}
      <div className={`p-6 rounded-lg mb-6 ${getLevelBgColor(result.level)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 mb-1">합격 가능성</p>
            <p className={`text-3xl font-bold ${getLevelColor(result.level)}`}>
              {result.level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-700 mb-1">합격 확률</p>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={
                    result.level === '안정'
                      ? '#10B981'
                      : result.level === '적정'
                      ? '#3B82F6'
                      : result.level === '소신'
                      ? '#F59E0B'
                      : result.level === '도전'
                      ? '#F97316'
                      : '#EF4444'
                  }
                  strokeWidth="10"
                  strokeDasharray={`${result.probability * 2.827} 282.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="7"
                  className="text-xl font-bold"
                  fill="currentColor"
                >
                  {result.probability.toFixed(0)}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 과거 3개년도 커트라인 차트 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          📈 최근 3개년도 입시 결과
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="년도" />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="70%컷"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="평균컷"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="최고컷"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="내 점수"
              stroke="#EF4444"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 데이터 테이블 */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          📋 연도별 상세 정보
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  년도
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  70% 컷
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  평균 컷
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  최고 컷
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  경쟁률
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  지원자
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.yearlyData.map((data) => (
                <tr key={data.year}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {data.year}년
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {data.cutScore70.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {data.cutScoreAvg.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {data.cutScoreTop.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {data.competition.toFixed(2)} : 1
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {data.applicants}명
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 조언 메시지 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>💡 조언:</strong>{' '}
          {result.level === '안정'
            ? '합격 가능성이 매우 높습니다. 안정적인 지원이 가능합니다.'
            : result.level === '적정'
            ? '적정 수준입니다. 합격 가능성이 높으니 적극 지원을 고려해보세요.'
            : result.level === '소신'
            ? '소신 지원 구간입니다. 다른 안정 지원도 함께 고려하세요.'
            : result.level === '도전'
            ? '도전 구간입니다. 신중하게 결정하시고, 안정 지원을 병행하세요.'
            : '합격 가능성이 낮습니다. 다른 대학/학과를 고려해보세요.'}
        </p>
      </div>
    </div>
  );
}
