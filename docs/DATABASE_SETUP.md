# 데이터베이스 설정 가이드

## 목차
1. [PostgreSQL 설치](#1-postgresql-설치)
2. [데이터베이스 생성](#2-데이터베이스-생성)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [Prisma 마이그레이션](#4-prisma-마이그레이션)
5. [데이터 시딩](#5-데이터-시딩)
6. [트러블슈팅](#6-트러블슈팅)

## 1. PostgreSQL 설치

### macOS (Homebrew)
```bash
# PostgreSQL 설치
brew install postgresql@15

# PostgreSQL 서비스 시작
brew services start postgresql@15

# 설치 확인
psql --version
```

### Linux (Ubuntu/Debian)
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 설치 확인
psql --version
```

### Windows
1. [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 설치 프로그램 다운로드
2. 설치 프로그램 실행 및 기본 설정으로 설치
3. 설치 중 postgres 사용자의 비밀번호 설정

### Docker (모든 OS)
```bash
# PostgreSQL 컨테이너 실행
docker run --name daeyip-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=daeyip \
  -p 5432:5432 \
  -d postgres:15

# 컨테이너 상태 확인
docker ps
```

## 2. 데이터베이스 생성

### PostgreSQL 접속
```bash
# macOS/Linux
psql postgres

# Windows (psql이 PATH에 있다면)
psql -U postgres

# Docker
docker exec -it daeyip-postgres psql -U postgres
```

### 데이터베이스 및 사용자 생성
```sql
-- 데이터베이스 생성
CREATE DATABASE daeyip;

-- 사용자 생성 (선택사항)
CREATE USER daeyip_user WITH PASSWORD 'your_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON DATABASE daeyip TO daeyip_user;

-- 연결 종료
\q
```

## 3. 환경 변수 설정

### .env 파일 설정
프로젝트 루트에 `.env` 파일을 생성하거나 수정합니다:

```bash
# .env.example을 복사하여 .env 생성
cp .env.example .env
```

`.env` 파일 내용 수정:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/daeyip?schema=public"

# 사용자를 생성했다면:
# DATABASE_URL="postgresql://daeyip_user:your_password@localhost:5432/daeyip?schema=public"

# Docker를 사용하는 경우:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/daeyip?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# JWT Secret (안전한 랜덤 문자열로 변경)
JWT_SECRET="your-secret-key-here-change-this"

# bcrypt salt rounds
BCRYPT_ROUNDS=10
```

### DATABASE_URL 형식
```
postgresql://[사용자명]:[비밀번호]@[호스트]:[포트]/[데이터베이스명]?schema=public
```

## 4. Prisma 마이그레이션

### 마이그레이션 생성 및 실행
```bash
# Prisma 스키마 검증
npx prisma validate

# 마이그레이션 생성
npx prisma migrate dev --name init

# Prisma Client 생성 (자동으로 실행되지만 수동으로도 가능)
npx prisma generate
```

### Prisma Studio로 데이터 확인
```bash
# Prisma Studio 실행 (GUI 데이터베이스 관리 도구)
npx prisma studio
```

브라우저에서 `http://localhost:5555`로 접속하여 데이터를 확인하고 관리할 수 있습니다.

## 5. 데이터 시딩

초기 데이터를 데이터베이스에 삽입합니다.

### 시드 스크립트 실행
```bash
# 시드 데이터 삽입
npx prisma db seed
```

**참고**: 시드 스크립트는 별도로 작성해야 합니다. (`prisma/seed.ts` 파일)

### 시드 스크립트 예시
`prisma/seed.ts` 파일을 생성하고 다음 내용을 추가:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 대학 데이터 삽입
  const yonsei = await prisma.university.create({
    data: {
      id: 'yonsei',
      name: '연세대학교',
    },
  });

  console.log('대학 데이터 삽입 완료');

  // 모집단위 데이터 삽입
  await prisma.department.createMany({
    data: [
      {
        id: 'yonsei-business',
        universityId: 'yonsei',
        name: '경영대학',
        track: '인문',
        quota: 180,
      },
      {
        id: 'yonsei-engineering',
        universityId: 'yonsei',
        name: '공과대학',
        track: '자연',
        quota: 600,
      },
    ],
  });

  console.log('모집단위 데이터 삽입 완료');

  // 추가 데이터...
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

`package.json`에 시드 명령 추가:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## 6. 트러블슈팅

### 연결 오류
**문제**: `Can't reach database server`

**해결**:
```bash
# PostgreSQL 서비스가 실행 중인지 확인
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Docker
docker ps

# PostgreSQL 재시작
# macOS
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql

# Docker
docker restart daeyip-postgres
```

### 포트 충돌
**문제**: `Port 5432 is already in use`

**해결**:
```bash
# 5432 포트를 사용하는 프로세스 확인
# macOS/Linux
lsof -i :5432

# Windows
netstat -ano | findstr :5432

# 다른 포트 사용 (예: 5433)
# .env 파일의 DATABASE_URL 수정
DATABASE_URL="postgresql://postgres:password@localhost:5433/daeyip?schema=public"
```

### 마이그레이션 실패
**문제**: 마이그레이션이 실패하거나 데이터베이스가 오염됨

**해결**:
```bash
# 데이터베이스 초기화 (모든 데이터 삭제!)
npx prisma migrate reset

# 특정 마이그레이션만 실행 취소
npx prisma migrate resolve --rolled-back <migration_name>

# 마이그레이션 상태 확인
npx prisma migrate status
```

### Prisma Client 오류
**문제**: `@prisma/client did not initialize yet`

**해결**:
```bash
# Prisma Client 재생성
npx prisma generate

# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

## 유용한 Prisma 명령어

```bash
# 스키마 포맷팅
npx prisma format

# 데이터베이스 스키마 확인
npx prisma db pull

# 마이그레이션 없이 스키마 동기화 (개발 중에만 사용)
npx prisma db push

# 모든 마이그레이션 및 데이터 삭제 후 재생성
npx prisma migrate reset

# Prisma Studio 실행
npx prisma studio
```

## 프로덕션 환경 설정

### 1. 환경 변수 설정
프로덕션 환경에서는 안전한 비밀번호와 JWT_SECRET을 사용하세요.

```env
DATABASE_URL="postgresql://user:secure_password@production-host:5432/daeyip?schema=public"
JWT_SECRET="very-long-random-string-generated-securely"
BCRYPT_ROUNDS=12
```

### 2. 마이그레이션 배포
```bash
# 프로덕션 마이그레이션 (데이터 손실 없음)
npx prisma migrate deploy
```

### 3. 연결 풀링 (선택사항)
고성능이 필요한 경우 Prisma Accelerate 또는 PgBouncer 사용을 고려하세요.

```env
# Prisma Accelerate 예시
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"
DIRECT_URL="postgresql://user:password@host:5432/daeyip"
```

## 추가 리소스
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Prisma 마이그레이션 가이드](https://www.prisma.io/docs/concepts/components/prisma-migrate)
