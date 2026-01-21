import { eventSource, event_types } from "../../../../../script.js";
import { state } from "./state.js";

/**
 * 알림음 모듈 초기화
 * - MESSAGE_RECEIVED 이벤트 사용 (ST 기본 로직과 동일)
 * - 실제로 새 메시지가 채팅에 추가될 때만 발생
 * - Stop 버튼, 에러, quiet 모드에서는 발생 안 함
 */
export function initNotificationSound() {
    // 탭 가시성 추적
    document.addEventListener("visibilitychange", () => {
        state.isTabVisible = !document.hidden;
    });

    // 커스텀 오디오 요소 생성
    createAudioElement();

    // MESSAGE_RECEIVED: 실제로 새 메시지가 추가될 때만 발생
    // (Stop 버튼, 에러, quiet 모드에서는 발생 안 함)
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);

    // 이벤트 리스너
    window.addEventListener("stc-notification-update", createAudioElement);
    window.addEventListener("stc-notification-test", playNotification);
}

/**
 * 오디오 요소 생성/업데이트 (커스텀 사운드용)
 */
function createAudioElement() {
    const settings = state.settings.notification;

    // 기존 오디오 제거
    if (state.notificationAudio) {
        state.notificationAudio.pause();
        state.notificationAudio = null;
    }

    // 커스텀 사운드가 있을 때만 오디오 생성
    if (settings.useCustomSound && settings.customSound) {
        state.notificationAudio = new Audio();
        state.notificationAudio.src = settings.customSound;
        state.notificationAudio.volume = settings.volume;
        state.notificationAudio.preload = "auto";
    }
}

/**
 * 메시지 수신 핸들러
 * MESSAGE_RECEIVED는 실제로 새 메시지가 추가될 때만 발생
 */
function onMessageReceived() {
    const settings = state.settings.notification;

    if (!settings.enabled) return;

    // 백그라운드에서만 재생 옵션
    if (settings.playOnlyBackground && state.isTabVisible) return;

    playNotification();
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
    } else {
        // ST 기본 알림음 재생 (SillyTavern 내장 기능 호출)
        // ST의 audio_notification 함수 또는 기본 오디오 사용
        try {
            // ST 기본 알림음 요소 찾기
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
}
