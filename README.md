# ST Customizer

SillyTavern을 더 예쁘게, 더 편하게 커스터마이징할 수 있는 확장 프로그램입니다.

## ✨ 주요 기능

### 🎨 타이핑 인디케이터 (Typing Indicator)
AI 응답 생성 중 표시되는 인디케이터를 다양하게 커스터마이징

- **기본 스타일**: Fade, Heart, Star
- **크리스탈 스타일**: 5가지 색상 (기본, 핑크, 민트, 퍼플, 골드)
- **하트비트 스타일**: 4가지 색상 (핑크, 그레이, 화이트, 라벤더)
- **픽셀PC 스타일**: 4가지 색상 (기본, 핑크, 퍼플, 블랙)
- **GIF 스타일**: 빵고양이, 노트북고양이, 글쓰는고양이, 타이핑고양이 등
- **커스텀 스타일**: 직접 이미지 업로드, 컨테이너/텍스트 색상 설정
- **타이핑 효과**: 글자가 한 글자씩 나타나는 타자기 효과 (ON/OFF)
- **폰트 선택**: 12종 한글 웹폰트 지원
- **줄바꿈 지원**: 여러 줄 텍스트 표시 가능
- `{{char}}` 템플릿으로 캐릭터 이름 자동 치환

### 🔖 파비콘 (Favicon)
브라우저 탭 아이콘 커스터마이징

- 5가지 프리셋 아이콘 제공
- 커스텀 이미지 업로드 (PNG, JPG, ICO, SVG)

### 🔔 알림음 (Notification Sound)
메시지 도착 시 알림음 재생

- 커스텀 사운드 업로드 (MP3, WAV, OGG)
- 볼륨 조절
- 실제 메시지 도착 시에만 재생 (Stop 버튼 등에 반응 안 함)

### ✏️ 입력창 플레이스홀더 (Placeholder)
메시지 입력창 안내 텍스트 변경

- 원하는 문구로 자유롭게 설정

## 📦 설치 방법

### 방법 1: Git Clone (권장)
```bash
cd SillyTavern/data/default-user/extensions
git clone https://github.com/NovaCaso01/ST-Customizer.git
```

### 방법 2: 수동 설치
1. [GitHub 릴리즈](https://github.com/NovaCaso01/ST-Customizer/releases)에서 최신 버전 다운로드
2. `ST-Customizer` 폴더를 `SillyTavern/data/default-user/extensions/`에 복사
3. SillyTavern 재시작

## ⚙️ 사용 방법

1. SillyTavern 실행
2. 확장 패널 (🧩) 클릭
3. "ST Customizer" 섹션에서 원하는 기능 활성화
4. 실시간 미리보기로 확인하며 설정

## 🎯 특징

- 🎨 깔끔하고 직관적인 설정 UI
- 👁️ 실시간 미리보기 지원
- 💾 설정 자동 저장 (새로고침해도 유지)
- 📱 모바일 환경 최적화
- ⚡ 가벼운 성능

---

## 📝 버전 기록

### v1.0.3
**버그 수정**
- 🐛 입력창 플레이스홀더 수정 시 ST 프리징 (MutationObserver 무한 루프 수정)
- 🐛 플레이스홀더 옵저버 누적 생성 방지

### v1.0.2
- 초기 릴리즈
