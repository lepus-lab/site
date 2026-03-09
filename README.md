# Lepus Lab — static site for lepuslab.dev

GitHub에 push한 뒤 Vercel에서 Import 하면 바로 배포되는 정적 사이트입니다.

## 반영된 사항

- 도메인: `https://lepuslab.dev`
- canonical / Open Graph / Twitter metadata 반영
- `robots.txt`, `sitemap.xml` 포함
- Premium / Minimal 뷰 전환
- Mixed / English / Korean 카피 전환
- 외부 라이브러리, 빌드 툴, 환경변수 의존성 없음

## 파일 구조

- `index.html`
- `styles.css`
- `script.js`
- `favicon.svg`
- `og-image.svg`
- `robots.txt`
- `sitemap.xml`
- `vercel.json`
- `assets/space-bg.svg`
- `assets/brand-mark.svg`

## GitHub → Vercel 배포

```bash
git init
git add .
git commit -m "Initial Lepus Lab site"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

그 다음 Vercel에서:

1. Add New → Project
2. GitHub repository 선택
3. Import
4. 별도 build 설정 없이 Deploy

## 커스터마이즈 포인트

- 문구 수정: `index.html`
- 스타일 수정: `styles.css`
- 토글 동작 수정: `script.js`
- OG 미리보기 이미지 수정: `og-image.svg`
- 배경 비주얼 수정: `assets/space-bg.svg`
- 브랜드 마크 수정: `assets/brand-mark.svg`

## 권장 도메인 설정

Vercel Project Settings에서 `lepuslab.dev`를 연결하고,
`www`를 쓰지 않을 계획이면 apex 도메인을 primary 로 두는 구성이 가장 단순합니다.
