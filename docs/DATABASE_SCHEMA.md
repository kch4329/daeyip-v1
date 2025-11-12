# 데이터베이스 스키마 설계

## 개요
대입 정시모집 합격 예측 서비스를 위한 데이터베이스 스키마 설계

## ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   users     │       │ user_scores  │       │ user_predictions│
├─────────────┤       ├──────────────┤       ├─────────────────┤
│ id          │──────<│ user_id (FK) │       │ id              │
│ email       │       │ korean_*     │       │ user_id (FK)    │
│ password    │       │ math_*       │       │ department_id   │
│ name        │       │ english_*    │       │ converted_score │
│ phone       │       │ inquiry1_*   │       │ prediction_level│
│ created_at  │       │ inquiry2_*   │       │ created_at      │
│ updated_at  │       │ korean_hist* │       └─────────────────┘
└─────────────┘       │ created_at   │
                      │ updated_at   │
                      └──────────────┘

┌──────────────┐      ┌─────────────────┐      ┌──────────────────┐
│ universities │      │  departments    │      │ admission_results│
├──────────────┤      ├─────────────────┤      ├──────────────────┤
│ id           │─────<│ university_id   │─────<│ department_id(FK)│
│ name         │      │ id              │      │ year             │
│ created_at   │      │ name            │      │ cut_score_70     │
│ updated_at   │      │ track           │      │ cut_score_avg    │
└──────────────┘      │ quota           │      │ cut_score_top    │
                      │ created_at      │      │ applicants       │
                      │ updated_at      │      │ admitted         │
                      └─────────────────┘      │ competition      │
                               │               │ additional_pass  │
                               │               │ created_at       │
                               │               └──────────────────┘
                               │
                               │               ┌────────────────────┐
                               └──────────────<│ conversion_formulas│
                                               ├────────────────────┤
                                               │ id                 │
                                               │ university_id (FK) │
                                               │ department_id (FK) │
                                               │ year               │
                                               │ track              │
                                               │ formula_type       │
                                               │ korean_weight      │
                                               │ math_weight        │
                                               │ inquiry_weight     │
                                               │ english_weight     │
                                               │ korean_history_wt  │
                                               │ second_lang_weight │
                                               │ english_deductions │
                                               │ korean_hist_deduct │
                                               │ description        │
                                               │ created_at         │
                                               │ updated_at         │
                                               └────────────────────┘
```

## 테이블 상세 설명

### 1. users (사용자)
사용자 계정 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 사용자 고유 ID |
| email | String | UNIQUE, NOT NULL | 이메일 (로그인 ID) |
| password | String | NOT NULL | 암호화된 비밀번호 (bcrypt) |
| name | String | NOT NULL | 사용자 이름 |
| phone | String | NULL | 휴대전화번호 |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

### 2. user_scores (사용자 수능 성적)
사용자의 수능 성적 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 성적 기록 고유 ID |
| user_id | UUID | FK, NOT NULL | 사용자 ID (users.id) |
| korean_subject | String | NULL | 국어 선택과목 |
| korean_standard_score | Int | NULL | 국어 표준점수 |
| korean_percentile | Int | NULL | 국어 백분위 |
| korean_grade | Int | NULL | 국어 등급 (1-9) |
| math_subject | String | NULL | 수학 선택과목 |
| math_standard_score | Int | NULL | 수학 표준점수 |
| math_percentile | Int | NULL | 수학 백분위 |
| math_grade | Int | NULL | 수학 등급 (1-9) |
| english_grade | Int | NULL | 영어 등급 (1-9, 절대평가) |
| inquiry1_subject | String | NULL | 탐구1 과목명 |
| inquiry1_standard_score | Int | NULL | 탐구1 표준점수 |
| inquiry1_percentile | Int | NULL | 탐구1 백분위 |
| inquiry1_grade | Int | NULL | 탐구1 등급 (1-9) |
| inquiry2_subject | String | NULL | 탐구2 과목명 |
| inquiry2_standard_score | Int | NULL | 탐구2 표준점수 |
| inquiry2_percentile | Int | NULL | 탐구2 백분위 |
| inquiry2_grade | Int | NULL | 탐구2 등급 (1-9) |
| korean_history_grade | Int | NULL | 한국사 등급 (1-9, 절대평가) |
| second_language_grade | Int | NULL | 제2외국어/한문 등급 (선택) |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

### 3. universities (대학)
대학 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | String | PK | 대학 고유 ID (예: 'yonsei', 'korea') |
| name | String | NOT NULL | 대학명 |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

### 4. departments (모집단위)
대학의 모집단위 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | String | PK | 모집단위 고유 ID |
| university_id | String | FK, NOT NULL | 대학 ID (universities.id) |
| name | String | NOT NULL | 모집단위명 |
| track | Enum | NOT NULL | 계열 ('인문', '자연', '예체능') |
| quota | Int | NOT NULL | 모집인원 |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

### 5. admission_results (입시 결과)
대학별 모집단위별 입시 결과 데이터를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 입시 결과 고유 ID |
| department_id | String | FK, NOT NULL | 모집단위 ID (departments.id) |
| year | Int | NOT NULL | 학년도 |
| cut_score_70 | Float | NOT NULL | 70% 컷 환산점수 |
| cut_score_avg | Float | NOT NULL | 평균 컷 환산점수 |
| cut_score_top | Float | NOT NULL | 최종 컷 (최고점) 환산점수 |
| applicants | Int | NOT NULL | 지원자 수 |
| admitted | Int | NOT NULL | 합격자 수 (모집인원) |
| competition | Float | NOT NULL | 경쟁률 |
| additional_pass | Int | NULL | 추합 순위 (추가합격 인원) |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

**복합 고유 제약**: (department_id, year)

### 6. conversion_formulas (환산점수 계산식)
대학별/계열별/모집단위별 환산점수 계산 방식을 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 환산점수 계산식 고유 ID |
| university_id | String | FK, NOT NULL | 대학 ID (universities.id) |
| department_id | String | FK, NULL | 모집단위 ID (NULL이면 계열 공통) |
| year | Int | NOT NULL | 학년도 |
| track | Enum | NOT NULL | 계열 ('인문', '자연', '예체능') |
| formula_type | String | NOT NULL | 계산 방식 ('standardScore', 'percentile' 등) |
| korean_weight | Float | NULL | 국어 반영 비율 (%) |
| math_weight | Float | NULL | 수학 반영 비율 (%) |
| inquiry_weight | Float | NULL | 탐구 반영 비율 (%) |
| english_weight | Float | NULL | 영어 반영 비율 (%) |
| korean_history_weight | Float | NULL | 한국사 반영 비율 (%) |
| second_language_weight | Float | NULL | 제2외국어 반영 비율 (%) |
| english_deductions | Json | NULL | 영어 등급별 감점표 (예: {1: 0, 2: 0.5, ...}) |
| korean_history_deductions | Json | NULL | 한국사 등급별 감점표 |
| description | String | NULL | 계산식 설명 |
| created_at | DateTime | NOT NULL | 생성일시 |
| updated_at | DateTime | NOT NULL | 수정일시 |

**복합 고유 제약**: (university_id, department_id, year, track)

### 7. user_predictions (사용자 예측 결과) - 선택사항
사용자의 합격 예측 결과를 저장하는 테이블 (선택적 기능)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 예측 결과 고유 ID |
| user_id | UUID | FK, NOT NULL | 사용자 ID (users.id) |
| user_score_id | UUID | FK, NOT NULL | 사용자 성적 ID (user_scores.id) |
| department_id | String | FK, NOT NULL | 모집단위 ID (departments.id) |
| converted_score | Float | NOT NULL | 환산점수 |
| prediction_level | Enum | NOT NULL | 예측 레벨 ('안정', '적정', '소신', '도전', '불가능') |
| probability | Float | NOT NULL | 합격 확률 (0-100) |
| score_difference | Float | NOT NULL | 평균 컷과의 점수 차이 |
| created_at | DateTime | NOT NULL | 생성일시 |

## 인덱스 전략

### users
- `email` (UNIQUE 인덱스)

### user_scores
- `user_id` (외래키 인덱스)

### departments
- `university_id` (외래키 인덱스)
- `track` (검색용 인덱스)

### admission_results
- `(department_id, year)` (복합 고유 인덱스)
- `year` (검색용 인덱스)

### conversion_formulas
- `(university_id, department_id, year, track)` (복합 고유 인덱스)
- `year` (검색용 인덱스)

### user_predictions
- `user_id` (외래키 인덱스)
- `department_id` (외래키 인덱스)
- `created_at` (정렬용 인덱스)

## 데이터 타입 및 제약조건

### Enum 타입

#### Track (계열)
- `인문`
- `자연`
- `예체능`

#### PredictionLevel (예측 레벨)
- `안정`
- `적정`
- `소신`
- `도전`
- `불가능`

## 보안 고려사항

1. **비밀번호 암호화**: bcrypt를 사용하여 해싱 (최소 10 rounds)
2. **개인정보 보호**:
   - 휴대전화번호는 선택사항으로 처리
   - 사용자 성적 데이터는 사용자만 접근 가능
3. **UUID 사용**: 예측 불가능한 ID 생성으로 보안 강화

## 마이그레이션 전략

1. 초기 스키마 생성
2. 기본 대학 데이터 시드
3. 기존 TypeScript 파일의 데이터를 DB로 마이그레이션
4. 환산점수 계산식 데이터 시드
5. 입시 결과 데이터 시드

## 향후 확장 가능성

1. **사용자 권한 관리**: 관리자/일반 사용자 구분
2. **결제 시스템**: 프리미엄 기능 추가
3. **알림 시스템**: 입시 결과 업데이트 알림
4. **즐겨찾기**: 관심 대학/학과 저장
5. **커뮤니티 기능**: 사용자 간 정보 공유
