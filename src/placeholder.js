import { state } from "./state.js";

// 입력창 셀렉터
const INPUT_SELECTOR = "#send_textarea";
let originalPlaceholder = "";

/**
 * 플레이스홀더 모듈 초기화
 */
export function initPlaceholder() {
    const textarea = document.querySelector(INPUT_SELECTOR);
    if (textarea) {
        originalPlaceholder = textarea.placeholder || "";
    }

    // 초기 적용
    applyPlaceholder();

    // 이벤트 리스너
    window.addEventListener("stc-placeholder-update", applyPlaceholder);
}

/**
 * 플레이스홀더 적용
 */
function applyPlaceholder() {
    const settings = state.settings.placeholder;
    const textarea = document.querySelector(INPUT_SELECTOR);

    if (!textarea) return;

    if (!settings.enabled) {
        // 비활성화 시 원본 복원
        textarea.placeholder = originalPlaceholder;
        return;
    }

    textarea.placeholder = settings.customText || "Type a message...";
}
