# Vercel 배포 가이드

## 📋 배포 전 준비사항

### 1. 데이터베이스 설정

현재 프로젝트는 SQLite를 사용하지만, Vercel은 서버리스 환경이라 PostgreSQL 등 클라우드 데이터베이스가 필요합니다.

#### 옵션 A: Vercel Postgres (권장)

1. Vercel 대시보드에서 프로젝트 선택
2. **Storage** 탭 클릭
3. **Create Database** → **Postgres** 선택
4. 데이터베이스가 생성되면 자동으로 `DATABASE_URL` 환경 변수가 설정됨

#### 옵션 B: Supabase

1. [Supabase](https://supabase.com) 회원가입
2. 새 프로젝트 생성
3. **Settings** → **Database** 에서 Connection String 복사
4. Vercel 환경 변수에 `DATABASE_URL` 추가

### 2. Prisma Schema 수정

데이터베이스를 PostgreSQL로 변경:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite"에서 변경
  url      = env("DATABASE_URL")
}
```

### 3. 환경 변수 설정

Vercel 프로젝트 **Settings** → **Environment Variables**에 추가:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=무작위_긴_문자열
JWT_SECRET=무작위_긴_문자열
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BCRYPT_ROUNDS=10
```

**Secret 생성 방법:**
```bash
# 터미널에서 실행
openssl rand -base64 32
```

## 🚀 Vercel 배포 방법

### 방법 1: GitHub 연동 (권장)

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "feat: Vercel 배포 설정 추가"
   git push origin main
   ```

2. **Vercel 회원가입 및 프로젝트 연결**
   - [Vercel](https://vercel.com) 접속
   - **Sign Up with GitHub** 클릭
   - **Import Project** 선택
   - GitHub 저장소 선택 (kch4329/daeyip-v1)
   - **Import** 클릭

3. **프로젝트 설정**
   - Framework Preset: `Next.js` (자동 감지됨)
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
   - **Deploy** 클릭

4. **데이터베이스 마이그레이션**
   - 배포 완료 후, Vercel 대시보드의 **Settings** → **Environment Variables**에서 환경 변수 확인
   - **Deployments** 탭에서 최신 배포 선택
   - **...** 메뉴 → **Redeploy** 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## ⚙️ 배포 후 작업

### 1. 데이터베이스 마이그레이션

Vercel 대시보드에서 데이터베이스를 생성한 후:

```bash
# 로컬에서 실행 (DATABASE_URL을 Vercel 것으로 변경 후)
npx prisma migrate deploy

# 시드 데이터 추가
npm run db:seed
```

또는 Vercel Functions를 통해 자동화할 수 있습니다.

### 2. 도메인 설정 (선택)

- Vercel 대시보드 → **Settings** → **Domains**
- 원하는 도메인 추가

## 🔍 배포 확인

배포가 완료되면 Vercel이 제공하는 URL로 접속:
- `https://your-app.vercel.app`

## ⚠️ 주의사항

1. **환경 변수**: `.env` 파일은 GitHub에 푸시되지 않으므로 Vercel에서 직접 설정해야 합니다
2. **데이터베이스**: SQLite는 Vercel에서 작동하지 않으므로 반드시 PostgreSQL 등으로 변경
3. **Prisma Generate**: 빌드 시 자동으로 실행되도록 `vercel.json`에 설정되어 있습니다
4. **리전 설정**: `vercel.json`에서 `icn1` (서울)로 설정되어 있어 한국에서 빠른 응답 속도를 보장합니다

## 📚 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Prisma Vercel 배포](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
