import { eventSource, event_types } from "../../../../../script.js";
import { state } from "./state.js";

// AI 응답 생성 중인지 추적
let isGenerating = false;

// 알림이 아직 처리되지 않았는지 추적 (GENERATION_ENDED 안전망용)
let notificationPending = false;

/**
 * 알림음 모듈 초기화
 * - GENERATION_STARTED → isGenerating 플래그 설정
 * - MESSAGE_RECEIVED → 알림 재생 (주 경로)
 * - GENERATION_ENDED → 알림 재생 (안전망 - MESSAGE_RECEIVED 미발생 시)
 * - GENERATION_STOPPED → 플래그 리셋 (Stop 버튼, 알림 없이)
 * - CHAT_CHANGED → 상태 리셋
 */
export function initNotificationSound() {
    // 탭 가시성 초기화 - 현재 실제 상태로 동기화
    state.isTabVisible = !document.hidden;

    // 탭 가시성 추적
    document.addEventListener("visibilitychange", () => {
        state.isTabVisible = !document.hidden;
    });

    // 커스텀 오디오 요소 생성
    createAudioElement();

    // GENERATION_STARTED: 생성 시작 시 플래그 설정
    eventSource.on(event_types.GENERATION_STARTED, onGenerationStarted);

    // GENERATION_STOPPED: Stop 버튼 눌렀을 때 플래그 리셋 (알림 없이)
    eventSource.on(event_types.GENERATION_STOPPED, onGenerationStopped);

    // MESSAGE_RECEIVED: 메시지가 실제로 채팅에 추가될 때 (주 알림 경로)
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);

    // GENERATION_ENDED: 생성 완료 시 안전망 (MESSAGE_RECEIVED 미발생 대비)
    eventSource.on(event_types.GENERATION_ENDED, onGenerationEnded);

    // CHAT_CHANGED: 채팅 전환 시 상태 리셋
    eventSource.on(event_types.CHAT_CHANGED, onChatChanged);

    // 이벤트 리스너
    window.addEventListener("stc-notification-update", createAudioElement);
    window.addEventListener("stc-notification-test", playNotification);
}

/**
 * 생성 시작 핸들러
 */
function onGenerationStarted(type, options, dryRun) {
    // dryRun이 아닌 실제 생성일 때만
    if (dryRun === true) return;

    // quiet, impersonate 타입 제외
    const noNotifyTypes = ["quiet", "impersonate"];
    if (typeof type === "string" && noNotifyTypes.includes(type)) {
        return;
    }

    isGenerating = true;
    notificationPending = true;
}

/**
 * 생성 중단 핸들러 (Stop 버튼)
 */
function onGenerationStopped() {
    isGenerating = false;
    notificationPending = false;
}

/**
 * 메시지 수신 핸들러 (주 알림 경로)
 * MESSAGE_RECEIVED는 메시지가 채팅에 추가될 때 발생
 * isGenerating이 true일 때만 알림 재생 (채팅 로딩 시에는 false)
 */
function onMessageReceived(messageIndex) {
    // 실제로 생성 중이었을 때만 알림
    if (!isGenerating) return;

    // 플래그 리셋
    isGenerating = false;
    notificationPending = false;

    tryPlayNotification();
}

/**
 * 생성 완료 핸들러 (안전망)
 * MESSAGE_RECEIVED가 미발생하거나 타이밍이 맞지 않을 때 대비
 */
function onGenerationEnded() {
    // 이미 MESSAGE_RECEIVED에서 처리됨
    if (!notificationPending) {
        isGenerating = false;
        return;
    }

    // MESSAGE_RECEIVED에서 이미 처리된 경우
    if (!isGenerating) {
        notificationPending = false;
        return;
    }

    // MESSAGE_RECEIVED가 미발생 → 여기서 알림 처리
    isGenerating = false;
    notificationPending = false;

    tryPlayNotification();
}

/**
 * 채팅 변경 핸들러 - 상태 리셋
 */
function onChatChanged() {
    isGenerating = false;
    notificationPending = false;
}

/**
 * 알림 재생 조건 체크 후 재생
 */
function tryPlayNotification() {
    const settings = state.settings.notification;

    if (!settings.enabled) return;

    // 백그라운드에서만 재생 옵션
    if (settings.playOnlyBackground && state.isTabVisible) return;

    playNotification();
}

/**
 * 오디오 요소 생성/업데이트 (커스텀 사운드용)
 */
function createAudioElement() {
    const settings = state.settings.notification;

    // 기존 오디오 제거
    if (state.notificationAudio) {
        state.notificationAudio.pause();
        state.notificationAudio.removeEventListener("error", onAudioError);
        state.notificationAudio = null;
    }

    // 커스텀 사운드가 있을 때만 오디오 생성
    if (settings.useCustomSound && settings.customSound) {
        state.notificationAudio = new Audio();
        state.notificationAudio.src = settings.customSound;
        state.notificationAudio.volume = settings.volume;
        state.notificationAudio.preload = "auto";

        // 로드 에러 핸들링 (Base64 손상 등 대비)
        state.notificationAudio.addEventListener("error", onAudioError);
    }
}

/**
 * 오디오 로드 에러 핸들러
 */
function onAudioError(e) {
    console.warn("[ST-Customizer] Custom audio load failed:", e);
    // 커스텀 오디오 로드 실패 시 null로 설정 → playNotification에서 폴백 사용
    state.notificationAudio = null;
}

/**
 * 알림음 재생
 */
function playNotification() {
    const settings = state.settings.notification;

    // 커스텀 사운드 사용
    if (settings.useCustomSound && settings.customSound && state.notificationAudio) {
        state.notificationAudio.volume = settings.volume;
        state.notificationAudio.currentTime = 0;
        state.notificationAudio.play().catch(e => {
            console.warn("[ST-Customizer] Could not play custom notification sound:", e);
        });
        return;
    }

    // ST 기본 알림음 재생
    try {
        const stAudio = document.getElementById("audio_message_sound");
        if (stAudio) {
            stAudio.volume = settings.volume;
            stAudio.currentTime = 0;
            stAudio.play().catch(e => {
                console.warn("[ST-Customizer] Could not play ST notification sound:", e);
            });
        }
    } catch (e) {
        console.warn("[ST-Customizer] ST notification sound not available:", e);
    }
}
