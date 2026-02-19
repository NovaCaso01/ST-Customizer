import { state } from "./state.js";

// 입력창 셀렉터
const INPUT_SELECTOR = "#send_textarea";
let originalPlaceholder = "";
let observer = null;
let isApplying = false; // applyPlaceholder 재진입 방지 플래그

/**
 * 플레이스홀더 모듈 초기화
 */
export function initPlaceholder() {
    // DOM이 준비되었을 때 적용
    waitForTextarea().then(() => {
        const textarea = document.querySelector(INPUT_SELECTOR);
        if (textarea) {
            originalPlaceholder = textarea.placeholder || "";
        }
        applyPlaceholder();
    });

    // 이벤트 리스너
    window.addEventListener("stc-placeholder-update", applyPlaceholder);
    
    // MutationObserver로 textarea 변화 감지 (ST 재로드 시 대응)
    setupObserver();
}

/**
 * textarea가 DOM에 나타날 때까지 대기
 */
function waitForTextarea() {
    return new Promise((resolve) => {
        const textarea = document.querySelector(INPUT_SELECTOR);
        if (textarea) {
            resolve();
            return;
        }
        
        const checkObserver = new MutationObserver(() => {
            const el = document.querySelector(INPUT_SELECTOR);
            if (el) {
                checkObserver.disconnect();
                resolve();
            }
        });
        
        checkObserver.observe(document.body, { childList: true, subtree: true });
        
        // 타임아웃 (5초)
        setTimeout(() => {
            checkObserver.disconnect();
            resolve();
        }, 5000);
    });
}

/**
 * MutationObserver 설정 - placeholder 속성 변경 감지
 */
function setupObserver() {
    if (observer) {
        observer.disconnect();
    }
    
    // textarea 속성 변경 감지
    const checkAndObserve = () => {
        // 기존 옵저버 정리 후 새로 생성 (누적 방지)
        if (observer) {
            observer.disconnect();
        }

        const textarea = document.querySelector(INPUT_SELECTOR);
        if (textarea) {
            observer = new MutationObserver((mutations) => {
                if (isApplying) return; // applyPlaceholder 실행 중이면 무시
                for (const mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === "placeholder") {
                        // ST가 placeholder를 변경했을 때 다시 적용
                        const settings = state.settings.placeholder;
                        const effectiveText = settings.customText || "Type a message...";
                        if (settings.enabled && textarea.placeholder !== effectiveText) {
                            applyPlaceholder();
                        }
                    }
                }
            });
            observer.observe(textarea, { attributes: true, attributeFilter: ["placeholder"] });
        }
    };
    
    // 초기 설정
    checkAndObserve();
    
    // 채팅 변경 시 재설정
    window.addEventListener("stc-chat-changed", () => {
        setTimeout(checkAndObserve, 100);
    });
}

/**
 * 플레이스홀더 적용
 */
function applyPlaceholder() {
    if (isApplying) return; // 재진입 방지
    isApplying = true;

    try {
        const settings = state.settings.placeholder;
        const textarea = document.querySelector(INPUT_SELECTOR);

        if (!textarea) return;

        if (!settings.enabled) {
            // 비활성화 시 원본 복원
            textarea.placeholder = originalPlaceholder;
            return;
        }

        textarea.placeholder = settings.customText || "Type a message...";
    } finally {
        isApplying = false;
    }
}
