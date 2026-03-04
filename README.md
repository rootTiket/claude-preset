# claude-preset

Claude Code 프로젝트 설정을 자동으로 구성해주는 CLI 도구.  
Skills, Hooks, MCP, Commands, Rules를 쉽게 관리합니다.

## 설치

```bash
git clone https://github.com/rootTiket/claude-preset.git
cd claude-preset
npm install
npm link
```

이제 어디서든 `claude-kit` 명령을 사용할 수 있습니다.

## 사용법

```bash
# 프로젝트 초기화
claude-kit init

# 스킬 추가
claude-kit add skill my-feature --template feature
claude-kit add skill my-fix --template fix

# 프리셋 적용 (nextjs, react)
claude-kit preset nextjs

# 현재 설정 확인
claude-kit list

# 설정 검증
claude-kit validate
```

## 스킬 템플릿

| 템플릿 | 용도 | 사용 예 |
|--------|------|---------|
| `feature` | 새 기능 개발 | `claude-kit add skill login --template feature` |
| `fix` | 버그 수정 | `claude-kit add skill hotfix --template fix` |
| `refactor` | 코드 리팩토링 | `claude-kit add skill cleanup --template refactor` |
| `docs` | 문서 작성 | `claude-kit add skill readme --template docs` |
| `test` | 테스트 작성 | `claude-kit add skill unit-test --template test` |
| `review` | 코드 리뷰 | `claude-kit add skill pr-review --template review` |
| `blank` | 커스텀 | `claude-kit add skill custom --template blank` |

## 업데이트

```bash
cd claude-preset
git pull
npm run build
```
