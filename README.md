# 🎓 대입 정시모집 합격 예측 서비스

진학사 칸 수 예측 시스템보다 뛰어난 차세대 대학 입시 예측 플랫폼

## 📌 프로젝트 개요

대한민국 전국 주요 4년제 대학별 입시결과 분석 및 수시/정시 합격예측 서비스입니다.
수능 성적을 입력하면 AI 기반 알고리즘으로 대학별 합격 가능성을 예측합니다.

## ✨ 주요 기능

### 1. 🖼️ 성적표 사진 인식 (OCR)
- 성적표 사진을 업로드하면 자동으로 성적 입력
- Tesseract.js 기반 클라이언트 사이드 OCR
- 시간 절약 및 입력 오류 최소화

### 2. 📝 성적 입력
- 표준점수, 백분위, 등급 입력 지원
- 국어, 수학, 영어, 한국사, 탐구 과목별 입력
- 반응형 디자인으로 모바일 최적화

### 3. 🏛️ 대학 선택
- 주요 대학교 데이터베이스
- 인문/자연/예체능 계열별 분류
- 모집단위별 상세 정보

### 4. 🧮 환산점수 계산
- 대학별 맞춤 환산점수 자동 계산
- 계열별 차등 반영 비율 적용
- 실시간 점수 계산

### 5. 📊 합격 예측
- 과거 3-4개년도 입시 데이터 기반 예측
- 70% 컷, 평균 컷, 최고 컷 비교
- 5단계 예측 레벨: 안정/적정/소신/도전/불가능
- 합격 확률 퍼센트 표시

### 6. 📈 데이터 시각화
- Recharts 기반 인터랙티브 차트
- 연도별 커트라인 추이 그래프
- 합격 확률 게이지
- 상세 데이터 테이블

## 🚀 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Form Management**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand
- **OCR**: Tesseract.js

### Backend
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: bcryptjs

### Development
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier

## 📁 프로젝트 구조

```
daeyip-v1/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── ScoreInput.tsx     # 성적 입력 컴포넌트
│   ├── ImageUpload.tsx    # 사진 업로드 컴포넌트
│   ├── UniversitySelector.tsx  # 대학 선택 컴포넌트
│   └── PredictionResult.tsx    # 예측 결과 컴포넌트
├── lib/                   # 유틸리티 및 로직
│   ├── scoreCalculator.ts # 환산점수 계산
│   ├── predictionEngine.ts # 합격 예측 알고리즘
│   └── prisma.ts          # Prisma Client 인스턴스
├── prisma/                # Prisma 설정
│   ├── schema.prisma      # 데이터베이스 스키마
│   └── seed.ts            # 시드 데이터
├── data/                  # 데이터 (시드용)
│   ├── universities.ts    # 대학 정보
│   ├── admissionData.ts   # 과거 입시 데이터
│   └── conversionFormulas.ts # 환산점수 계산식
├── types/                 # TypeScript 타입 정의
│   └── index.ts
├── docs/                  # 문서
│   ├── DATABASE_SCHEMA.md # 데이터베이스 스키마 설계
│   └── DATABASE_SETUP.md  # 데이터베이스 설정 가이드
└── TECH_STACK.md         # 기술 스택 문서
```

## 🛠️ 설치 및 실행

### 요구사항
- Node.js 18.0 이상
- npm 또는 yarn
- PostgreSQL 15 이상

### 설치

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 DATABASE_URL 등을 수정

# 3. 데이터베이스 설정
# PostgreSQL이 실행 중인지 확인
# 상세한 설정 방법은 docs/DATABASE_SETUP.md 참고

# 4. Prisma 마이그레이션 및 시드 데이터 삽입
npm run db:migrate
npm run db:seed
```

### 데이터베이스 명령어

```bash
# Prisma Client 생성
npm run db:generate

# 마이그레이션 생성 및 적용 (개발)
npm run db:migrate

# 마이그레이션 적용만 (프로덕션)
npm run db:migrate:deploy

# 스키마를 데이터베이스에 동기화 (마이그레이션 없이)
npm run db:push

# Prisma Studio 실행 (GUI 데이터베이스 관리)
npm run db:studio

# 시드 데이터 삽입
npm run db:seed

# 데이터베이스 초기화 (모든 데이터 삭제)
npm run db:reset
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 🎯 사용 방법

1. **성적 입력**
   - 성적표 사진을 업로드하거나
   - 직접 과목별 성적 입력 (표준점수, 백분위, 등급)

2. **대학 선택**
   - 지원하고자 하는 대학교 선택
   - 계열 선택 (인문/자연/예체능)
   - 모집단위 선택

3. **합격 예측**
   - "합격 가능성 예측하기" 버튼 클릭
   - 환산점수 자동 계산
   - 과거 입시 데이터와 비교
   - 합격 가능성 및 확률 확인

## 📊 진학사 대비 개선점

| 기능 | 진학사 | 본 서비스 |
|------|--------|-----------|
| UI/UX | 복잡하고 구식 | ✅ 모던하고 직관적 |
| 모바일 지원 | 부족 | ✅ 완벽한 반응형 |
| OCR 기능 | ❌ 없음 | ✅ 성적표 자동 인식 |
| 시각화 | 단순 | ✅ 인터랙티브 차트 |
| 데이터 표시 | 텍스트 중심 | ✅ 그래프 + 테이블 |
| 사용성 | 복잡 | ✅ 간편하고 빠름 |

## 🔮 향후 개발 계획

### Phase 1 (현재)
- ✅ 정시모집 합격 예측 기본 기능
- ✅ 주요 대학 데이터
- ✅ 성적표 OCR
- ✅ 데이터 시각화
- ✅ 데이터베이스 스키마 설계 및 구축

### Phase 2 (진행 중)
- [ ] 사용자 인증 시스템 (회원가입/로그인)
- [ ] 사용자별 성적 저장 및 관리
- [ ] 예측 결과 히스토리
- [ ] 더 많은 대학 데이터 추가

### Phase 3 (계획)
- [ ] 수시모집 합격 예측
- [ ] 실시간 모의지원 통계
- [ ] 지원 전략 추천 AI

### Phase 4 (계획)
- [ ] 모바일 앱 (React Native)
- [ ] 커뮤니티 기능
- [ ] 합격/불합격 후기
- [ ] 학과별 상세 정보
- [ ] 진로 추천 시스템

## 📝 라이선스

본 프로젝트는 교육 목적으로 개발되었습니다.

## ⚠️ 면책 조항

본 서비스의 예측 결과는 과거 입시 데이터를 기반으로 한 통계적 예측이며,
실제 합격 여부를 보장하지 않습니다.
최종 지원 결정은 사용자 본인의 판단에 따라 신중히 내려주시기 바랍니다.

## 👨‍💻 개발자

- 프로젝트 개발: Claude AI Assistant
- 기획 및 방향성: User Request

## 📧 문의

프로젝트 관련 문의사항이나 개선 제안은 이슈를 등록해주세요.

---

**Made with ❤️ for Korean Students**
