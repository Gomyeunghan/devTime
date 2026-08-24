## 기술적 특징

### 컴파운드 컴포넌트 패턴 + Portal
모달을 `BaseModal.Header / BaseModal.Body / BaseModal.Footer`로 구성하는
컴파운드 컴포넌트 패턴으로 설계했습니다.
사용처에서 필요한 슬롯만 조합해 사용할 수 있어 재사용성과 가독성을 높였습니다.
`createPortal`로 `#portal-root`에 렌더링하여 부모 컴포넌트의 스타일 영향을 차단합니다.

### API 추상화 & 자동 토큰 갱신
`src/api/client.ts`에 커스텀 `request<T>` 함수를 두어 모든 API 호출의 진입점을 통일했습니다.

- 모든 요청에 `Authorization: Bearer {token}` 자동 주입
- 401 응답 수신 시 Refresh Token으로 새 Access Token 발급 후 원 요청 자동 재시도
- Refresh Token도 만료된 경우 즉시 로그아웃 처리
- 도메인별 모듈 분리 (auth / timer / dashboard / rank / stack)

### 에러 처리
`ApiError` 커스텀 클래스로 HTTP 상태 코드와 메시지를 구조화하고,
`parseError` 함수로 서버 응답을 일관된 형태로 변환합니다.
React Query의 `enabled` 옵션으로 인증 상태에 따른 불필요한 요청을 방지합니다.

### 타이머 상태 관리
`TimerContext + useTimer` 커스텀 훅으로 복잡한 타이머 로직을 캡슐화했습니다.

- `setInterval` 기반 1초 단위 상태 업데이트
- 1분마다 현재 진행률을 서버에 자동 저장 (폴링)
- 일시정지/재개 상태를 `localStorage`에 유지하여 새로고침 후 복원

### 상태 관리
Zustand와 Context API를 함께 사용했습니다.
두 가지 전역 상태 관리 방식의 동작 원리와 차이점을 직접 학습하는 것을 목적으로,
인증 상태는 Zustand로, 타이머 상태는 Context API로 각각 구현했습니다.

| 상태 종류 | 도구 |
|---|---|
| 인증 (로그인 여부, 토큰) | Zustand |
| 타이머, 할 일 목록 | Context API |
| 서버 데이터 | React Query |
