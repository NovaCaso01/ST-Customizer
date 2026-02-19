import { state } from "./state.js";

/**
 * 탭 타이틀 모듈 초기화
 */
export function initTabTitle() {
    // 원본 타이틀 저장
    state.originalTitle = document.title;

    // 초기 적용
    applyTabTitle();

    // 이벤트 리스너
    window.addEventListener("stc-tabtitle-update", applyTabTitle);
}

/**
 * 탭 타이틀 적용
 */
function applyTabTitle() {
    const settings = state.settings.tabTitle;

    if (!settings.enabled) {
        // 비활성화 시 원본 복원
        if (state.originalTitle) {
            document.title = state.originalTitle;
        }
        return;
    }

    document.title = settings.customTitle || "SillyTavern";
}
