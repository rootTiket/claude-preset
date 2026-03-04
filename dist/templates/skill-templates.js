/**
 * Skill templates — practical development workflow templates.
 *
 * Templates: feature, fix, refactor, docs, test, review, blank
 *
 * Each template includes:
 * - Trigger conditions (when to activate)
 * - Step-by-step workflow
 * - Output format
 * - Customization guide (<!-- 커스터마이즈: ... --> comments)
 */
export function getSkillTemplate(template, ctx) {
    switch (template) {
        case 'feature':
            return featureTemplate(ctx);
        case 'fix':
            return fixTemplate(ctx);
        case 'refactor':
            return refactorTemplate(ctx);
        case 'docs':
            return docsTemplate(ctx);
        case 'test':
            return testTemplate(ctx);
        case 'review':
            return reviewTemplate(ctx);
        case 'blank':
        default:
            return blankTemplate(ctx);
    }
}
// ─── Feature ────────────────────────────────────────────────────
function featureTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 새 기능 개발 워크플로우입니다.
     프로젝트에 맞게 각 섹션의 내용을 수정하세요.
     🔧 수정 포인트는 <!-- 커스터마이즈: --> 주석으로 표시되어 있습니다. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "~기능 추가해줘"
- "~만들어줘"
- "새로운 ~를 구현해줘"

## Workflow

### Step 1: 요구사항 분석

사용자 요구사항을 파악하고 구현 범위를 정리합니다.

**확인사항:**
- 어떤 기능인지 명확한가?
- 기존 코드에 영향을 주는 부분은?
- 필요한 의존성이 있는가?

<!-- 커스터마이즈: 프로젝트별 체크리스트를 추가하세요.
     예: "디자인 시안이 있는가?", "API 스펙이 정해져 있는가?" -->

### Step 2: 구현 계획 수립

변경될 파일 목록과 구현 순서를 정리합니다.

**출력 형식:**
\`\`\`
## 구현 계획
- [ ] 파일1: 변경 내용 설명
- [ ] 파일2: 변경 내용 설명
\`\`\`

<!-- 커스터마이즈: 프로젝트 아키텍처에 맞는 파일 구조 규칙을 추가하세요.
     예: "컴포넌트는 src/features/<domain>/components/ 에 생성" -->

### Step 3: 구현

계획에 따라 코드를 작성합니다.

**규칙:**
- 기존 코드 스타일과 패턴을 따릅니다
- 타입 안전성을 유지합니다
- 하나의 커밋 단위로 작업합니다

<!-- 커스터마이즈: 프로젝트별 코딩 컨벤션을 추가하세요.
     예: "컴포넌트는 named export 사용", "훅은 use 접두사" -->

### Step 4: 검증

구현이 올바른지 확인합니다.

**검증 체크리스트:**
- [ ] 빌드 오류 없음
- [ ] 기존 테스트 통과
- [ ] 새 기능 동작 확인

<!-- 커스터마이즈: 프로젝트별 검증 명령을 추가하세요.
     예: "pnpm build && pnpm test --run" -->

## Error Handling

- 빌드 실패 시: 에러 메시지 분석 후 수정
- 테스트 실패 시: 기존 코드와 충돌 확인
`;
}
// ─── Fix ────────────────────────────────────────────────────────
function fixTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 버그 수정 워크플로우입니다.
     프로젝트의 디버깅 도구나 로깅 시스템에 맞게 수정하세요. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "~버그 고쳐줘"
- "~가 안 돼"
- "~에러가 나"
- "~수정해줘"

## Workflow

### Step 1: 문제 재현 및 분석

버그의 원인을 파악합니다.

**분석 절차:**
1. 에러 메시지 확인
2. 관련 코드 위치 파악
3. 재현 조건 정리

<!-- 커스터마이즈: 프로젝트별 로그 확인 방법을 추가하세요.
     예: "브라우저 콘솔 확인", "서버 로그 확인 (tail -f logs/app.log)" -->

### Step 2: 원인 진단

\`\`\`
## 버그 분석
- 증상: [무엇이 잘못되나]
- 원인: [왜 잘못되나]  
- 영향 범위: [어디까지 영향을 주나]
\`\`\`

### Step 3: 수정

**수정 원칙:**
- 최소한의 변경으로 문제를 해결합니다
- 사이드 이펙트가 없는지 확인합니다
- 원인을 직접 수정합니다 (증상만 가리지 않기)

<!-- 커스터마이즈: 프로젝트별 수정 규칙을 추가하세요.
     예: "핫픽스는 hotfix/ 브랜치에서", "수정 시 관련 테스트 추가 필수" -->

### Step 4: 검증

**검증 체크리스트:**
- [ ] 원래 버그가 해결되었는가
- [ ] 다른 기능에 영향이 없는가
- [ ] 빌드 통과
- [ ] 기존 테스트 통과

## Error Handling

- 원인 불명확 시: 로그 추가 후 재현 시도
- 수정 후 다른 곳에서 문제 발생 시: 롤백 후 재분석
`;
}
// ─── Refactor ────────────────────────────────────────────────────
function refactorTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 코드 리팩토링 워크플로우입니다.
     프로젝트 아키텍처와 코딩 컨벤션에 맞게 수정하세요. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "~리팩토링해줘"
- "~코드 정리해줘"
- "~분리해줘"
- "~를 ~패턴으로 바꿔줘"

## Workflow

### Step 1: 현재 상태 분석

리팩토링 대상 코드를 분석합니다.

**분석 항목:**
- 현재 코드의 문제점 (복잡도, 중복, 의존성 등)
- 영향 받는 파일 목록
- 기존 테스트 커버리지

### Step 2: 리팩토링 계획

\`\`\`
## 리팩토링 계획
- 목표: [개선 목표]
- 방법: [적용할 패턴/기법]
- 변경 파일:
  - [ ] 파일1: 변경 내용
  - [ ] 파일2: 변경 내용
- 리스크: [주의사항]
\`\`\`

<!-- 커스터마이즈: 프로젝트별 아키텍처 원칙을 추가하세요.
     예: "DDD 도메인 경계 유지", "순환 의존성 금지" -->

### Step 3: 실행

**리팩토링 원칙:**
- 기능 변경 없이 구조만 개선 (behavior-preserving)
- 한 번에 하나의 리팩토링만 적용
- 각 단계마다 테스트 통과 확인

<!-- 커스터마이즈: 프로젝트별 리팩토링 규칙을 추가하세요.
     예: "barrel export(index.ts) 패턴 유지" -->

### Step 4: 검증

**검증 체크리스트:**
- [ ] 모든 기존 테스트 통과 (기능 변화 없음 확인)
- [ ] 빌드 통과
- [ ] 코드 복잡도 감소 확인
- [ ] 린트 통과

## Error Handling

- 테스트 실패 시: 기능 변경이 발생한 부분 확인, 롤백 후 재시도
- 순환 의존성 발생 시: 의존성 그래프 분석 후 재설계
`;
}
// ─── Docs ────────────────────────────────────────────────────────
function docsTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 문서 작성/업데이트 워크플로우입니다.
     프로젝트의 문서 스타일과 구조에 맞게 수정하세요. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "README 작성해줘"
- "API 문서 업데이트해줘"
- "사용법 문서 만들어줘"
- "JSDoc/TSDoc 추가해줘"

## Workflow

### Step 1: 대상 파악

문서화 대상을 분석합니다.

**확인사항:**
- 어떤 코드/기능의 문서인가
- 대상 독자는 누구인가 (개발자, 사용자, 기여자)
- 기존 문서가 있는가

### Step 2: 문서 작성

**문서 유형별 구조:**

#### README
\`\`\`markdown
# 프로젝트명
## 개요
## 설치 방법
## 사용법
## API
## 라이선스
\`\`\`

#### API 문서
\`\`\`markdown
## 엔드포인트/함수명
- 설명
- 파라미터
- 반환값
- 사용 예시
\`\`\`

#### 인라인 주석 (JSDoc/TSDoc)
\`\`\`typescript
/**
 * 함수 설명
 * @param name - 파라미터 설명
 * @returns 반환값 설명
 * @example
 * const result = myFunction('input');
 */
\`\`\`

<!-- 커스터마이즈: 프로젝트별 문서 구조를 추가하세요.
     예: "CHANGELOG.md 형식은 Keep a Changelog 사용" -->

### Step 3: 검증

**검증 체크리스트:**
- [ ] 오타/문법 오류 없음
- [ ] 코드 예시가 실제로 동작하는가
- [ ] 링크가 올바른가
- [ ] 마크다운 렌더링이 깨지지 않는가
`;
}
// ─── Test ────────────────────────────────────────────────────────
function testTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 테스트 작성 워크플로우입니다.
     프로젝트의 테스트 프레임워크와 컨벤션에 맞게 수정하세요. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "테스트 작성해줘"
- "~에 대한 테스트 추가해줘"
- "테스트 커버리지 올려줘"

## Workflow

### Step 1: 테스트 대상 분석

테스트할 코드를 분석합니다.

**분석 항목:**
- 코드의 주요 로직 (분기, 엣지 케이스)
- 외부 의존성 (모킹 대상)
- 기존 테스트 현황

<!-- 커스터마이즈: 프로젝트별 테스트 도구를 명시하세요.
     예: "테스트 프레임워크: Vitest", "모킹: vi.mock()" -->

### Step 2: 테스트 구조 설계

\`\`\`
## 테스트 계획
- 단위 테스트: [함수/클래스별 테스트 항목]
- 통합 테스트: [모듈간 연동 테스트 항목]
- 엣지 케이스: [경계값, 에러 등]
\`\`\`

### Step 3: 테스트 작성

**테스트 작성 규칙:**

\`\`\`typescript
describe('대상 함수/컴포넌트', () => {
  // 정상 케이스
  it('should [기대 동작] when [조건]', () => {
    // Arrange
    // Act
    // Assert
  });

  // 엣지 케이스
  it('should [기대 동작] when [경계 조건]', () => {});

  // 에러 케이스
  it('should throw/return error when [비정상 입력]', () => {});
});
\`\`\`

<!-- 커스터마이즈: 프로젝트별 테스트 컨벤션을 추가하세요.
     예: "파일 위치: __tests__/ 또는 *.test.ts 같은 레벨"
     예: "테스트 ID 접두사: it('[UNIT-001]', ...)" -->

### Step 4: 실행 및 검증

**검증 체크리스트:**
- [ ] 모든 테스트 통과
- [ ] 커버리지 기준 충족
- [ ] 테스트가 독립적으로 실행 가능한가
- [ ] 모킹이 올바르게 정리되는가

<!-- 커스터마이즈: 프로젝트별 테스트 실행 명령을 추가하세요.
     예: "pnpm test --run", "npm test -- --coverage" -->
`;
}
// ─── Review ─────────────────────────────────────────────────────
function reviewTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈: 이 템플릿은 코드 리뷰 워크플로우입니다.
     프로젝트의 리뷰 기준과 체크리스트에 맞게 수정하세요. -->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "코드 리뷰해줘"
- "이 PR 리뷰해줘"
- "이 코드 어떤지 봐줘"
- "이 변경사항 검토해줘"

## Workflow

### Step 1: 변경사항 파악

변경된 코드를 분석합니다.

**확인 범위:**
- 변경된 파일 목록
- 변경의 목적/의도
- 영향 범위

### Step 2: 리뷰 기준에 따라 검토

**리뷰 카테고리:**

#### 🔴 Critical (반드시 수정)
- 보안 취약점
- 데이터 손실 가능성
- 프로덕션 장애 가능성

#### 🟡 Warning (수정 권장)
- 성능 이슈
- 에러 핸들링 누락
- 타입 안전성 문제

#### 🔵 Suggestion (개선 제안)
- 코드 가독성
- 네이밍 개선
- 중복 코드 제거

#### 💚 Good (잘한 점)
- 좋은 패턴 적용
- 적절한 테스트
- 명확한 코드

<!-- 커스터마이즈: 프로젝트별 리뷰 기준을 추가하세요.
     예: "접근성(a11y) 체크", "i18n 적용 여부" -->

### Step 3: 리뷰 결과 정리

**출력 형식:**
\`\`\`
## 코드 리뷰 결과

### Summary
변경 목적과 전체 평가

### Issues
🔴 [파일:라인] 설명 — 수정 제안
🟡 [파일:라인] 설명 — 수정 제안

### Suggestions
🔵 [파일:라인] 설명 — 개선 방법

### Good
💚 [파일:라인] 잘한 점
\`\`\`
`;
}
// ─── Blank ──────────────────────────────────────────────────────
function blankTemplate(ctx) {
    return `---
name: ${ctx.name}
description: ${ctx.description}
---

# ${formatTitle(ctx.name)}

<!-- 커스터마이즈 가이드
     ─────────────────
     이 템플릿은 빈 템플릿입니다. 아래 구조를 참고하여 직접 작성하세요.

     ## 필수 구조
     1. Trigger 섹션: 이 스킬이 언제 활성화되는지 정의
     2. Workflow 섹션: 단계별 실행 절차
     3. Error Handling: 실패 시 대응 방법

     ## 작성 팁
     - description에 "WHAT it does + WHEN to use it"을 명확하게
     - 각 Step에 구체적인 지시를 포함하세요
     - 예시를 포함하면 AI가 더 정확하게 수행합니다
     - 프로젝트별 규칙은 .claude/rules/에 별도 파일로 분리 가능
-->

## Trigger

이 스킬은 다음과 같은 요청에 활성화됩니다:
- "트리거 문구 1"
- "트리거 문구 2"

## Workflow

### Step 1: [단계명]

설명을 작성하세요.

### Step 2: [단계명]

설명을 작성하세요.

## Error Handling

- 실패 조건 1: 대응 방법
- 실패 조건 2: 대응 방법
`;
}
// ─── Helpers ────────────────────────────────────────────────────
function formatTitle(kebabName) {
    return kebabName
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
export const TEMPLATE_DESCRIPTIONS = {
    feature: '새 기능 개발 워크플로우 (기획 → 구현 → 검증)',
    fix: '버그 수정 워크플로우 (분석 → 진단 → 수정 → 검증)',
    refactor: '코드 리팩토링 워크플로우 (분석 → 계획 → 실행 → 검증)',
    docs: '문서 작성/업데이트 워크플로우 (README, API 문서, JSDoc)',
    test: '테스트 작성 워크플로우 (분석 → 설계 → 작성 → 실행)',
    review: '코드 리뷰 워크플로우 (변경사항 파악 → 검토 → 결과 정리)',
    blank: '빈 템플릿 (커스터마이징 가이드 포함)',
};
//# sourceMappingURL=skill-templates.js.map