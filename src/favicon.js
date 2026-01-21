import { state } from "./state.js";

/**
 * 파비콘 모듈 초기화
 */
export function initFavicon() {
    // 원본 파비콘 저장
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        state.originalFavicon = existingFavicon.href;
    }

    // 초기 적용
    applyFavicon();

    // 이벤트 리스너
    window.addEventListener("stc-favicon-update", applyFavicon);
}

/**
 * 파비콘 적용
 */
function applyFavicon() {
    const settings = state.settings.favicon;

    // 기존 파비콘 링크 제거
    const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');

    if (settings.enabled && settings.customIcon) {
        // 커스텀 파비콘 적용
        existingLinks.forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/x-icon";
        link.href = settings.customIcon;
        document.head.appendChild(link);
    } else if (state.originalFavicon) {
        // 원본 복원
        existingLinks.forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.href = state.originalFavicon;
        document.head.appendChild(link);
    }
}
