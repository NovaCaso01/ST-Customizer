import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";

import { DEFAULT_SETTINGS, EXTENSION_NAME } from "./src/constants.js";
import { state } from "./src/state.js";
import { createUI, updateUI } from "./src/ui.js";
import { initFavicon } from "./src/favicon.js";
import { initTabTitle } from "./src/tab-title.js";
import { initNotificationSound } from "./src/notification.js";
import { initPlaceholder } from "./src/placeholder.js";
import { initTypingIndicator } from "./src/typing-indicator.js";

// jQuery 로드 대기
jQuery(async () => {
    // 설정 초기화
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = structuredClone(DEFAULT_SETTINGS);
    }

    // 설정 병합 (새 설정 항목 추가 대응)
    for (const key in DEFAULT_SETTINGS) {
        if (extension_settings[EXTENSION_NAME][key] === undefined) {
            extension_settings[EXTENSION_NAME][key] = DEFAULT_SETTINGS[key];
        }
    }

    state.settings = extension_settings[EXTENSION_NAME];

    // UI 생성
    await createUI();

    // 각 기능 모듈 초기화
    initFavicon();
    initTabTitle();
    initNotificationSound();
    initPlaceholder();
    initTypingIndicator();

    console.log(`[${EXTENSION_NAME}] Extension loaded successfully!`);
});
