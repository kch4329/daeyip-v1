# 대입 정시모집 합격 예측 서비스 - 기술 스택

## 프로젝트 개요
진학사 칸 수 예측 시스템보다 뛰어난 대입 정시모집 합격 예측 서비스

## 핵심 기능
1. 수능/모의고사 성적 입력 (표준점수, 백분위, 등급)
2. 성적표 사진 업로드 및 OCR 자동 인식
3. 대학교/계열/모집단위 선택
4. 대학별 환산점수 자동 계산
5. 과거 3-4개년도 데이터 기반 합격 예측
6. 시각적 합격 가능성 표시

## 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Form Management**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand

### Backend & Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes

### OCR & AI
- **OCR Engine**: Tesseract.js (클라이언트) / Google Cloud Vision API (서버)
- **Image Processing**: Sharp

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## 진학사 대비 개선점
1. ✅ 모던한 반응형 UI/UX
2. ✅ 성적표 사진 OCR 자동 인식
3. ✅ 고급 데이터 시각화 (차트, 그래프)
4. ✅ 모바일 최적화
5. ✅ 개인화된 지원 전략 추천
