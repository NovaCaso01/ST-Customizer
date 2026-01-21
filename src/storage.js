import { extension_settings } from "../../../../extensions.js";
import { saveSettingsDebounced } from "../../../../../script.js";
import { EXTENSION_NAME } from "./constants.js";
import { state } from "./state.js";

/**
 * 설정 저장
 */
export function saveSettings() {
    extension_settings[EXTENSION_NAME] = state.settings;
    saveSettingsDebounced();
}

/**
 * 설정 로드
 */
export function loadSettings() {
    return extension_settings[EXTENSION_NAME];
}

/**
 * 파일을 Base64로 변환
 * @param {File} file 
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 설정 특정 키 업데이트
 * @param {string} category 
 * @param {string} key 
 * @param {any} value 
 */
export function updateSetting(category, key, value) {
    if (state.settings[category]) {
        state.settings[category][key] = value;
        saveSettings();
    }
}
