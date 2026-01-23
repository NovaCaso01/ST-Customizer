import { eventSource, event_types } from "../../../../../script.js";
import { state } from "./state.js";

// AI 응답 생성 중인지 추적
let isGenerating = false;

/**
 * 알림음 모듈 초기화
 * - MESSAGE_RECEIVED + isGenerating 플래그 조합 사용
 * - 실제 AI 생성 후 메시지가 도착했을 때만 알림
 * - 채팅 로딩, 채팅방 진입 시에는 isGenerating이 false라 발생 안 함
 * - Stop 버튼 시에는 MESSAGE_RECEIVED가 발생하지 않음
 */
export function initNotificationSound() {
    // 탭 가시성 추적
    document.addEventListener("visibilitychange", () => {
        state.isTabVisible = !document.hidden;
    });

    // 커스텀 오디오 요소 생성
    createAudioElement();

    // GENERATION_STARTED: 생성 시작 시 플래그 설정
    eventSource.on(event_types.GENERATION_STARTED, (type, options, dryRun) => {
        // dryRun이 아닌 실제 생성일 때만
        if (dryRun !== true) {
            // quiet, impersonate 타입 제외
            const noNotifyTypes = ["quiet", "impersonate"];
            if (typeof type === "string" && noNotifyTypes.includes(type)) {
                return;
            }
            isGenerating = true;
        }
    });

    // GENERATION_STOPPED: Stop 버튼 눌렀을 때 플래그 리셋
    eventSource.on(event_types.GENERATION_STOPPED, () => {
        isGenerating = false;
    });

    // MESSAGE_RECEIVED: 메시지가 실제로 채팅에 추가될 때
    // isGenerating이 true일 때만 알림 (채팅 로딩 시에는 false)
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
 * MESSAGE_RECEIVED는 메시지가 채팅에 추가될 때 발생
 * isGenerating이 true일 때만 알림 재생 (채팅 로딩 시에는 false)
 * Stop 버튼 시에는 MESSAGE_RECEIVED가 발생하지 않아서 알림 안 함
 */
function onMessageReceived(messageIndex) {
    // 실제로 생성 중이었을 때만 알림
    if (!isGenerating) return;
    
    // 플래그 리셋
    isGenerating = false;
    
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
