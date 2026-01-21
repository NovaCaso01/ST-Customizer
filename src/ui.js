import { EXTENSION_NAME, ICONS, TYPING_DESIGNS, TYPING_GIFS, FAVICON_PRESETS, TYPING_FONTS } from "./constants.js";
import { state } from "./state.js";
import { saveSettings, fileToBase64, updateSetting } from "./storage.js";

/**
 * 타자기 효과 텍스트 생성 (유니코드 지원)
 */
function createTypewriterText(text) {
    const parts = text.split(/<br\s*\/?>/gi);
    let charIndex = 0;
    
    return parts.map((part) => {
        const chars = [...part].map((char) => {
            const delay = charIndex * 80;
            charIndex++;
            return `<span class="stc-typewriter-char" style="animation-delay:${delay}ms">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
        return chars;
    }).join('<br>');
}

/**
 * UI 생성
 */
export async function createUI() {
    // 타이핑 디자인 옵션 HTML 생성
    const typingDesignOptions = TYPING_DESIGNS.map(d => 
        `<option value="${d.id}">${d.name}</option>`
    ).join("");

    // 타이핑 폰트 옵션 HTML 생성
    const typingFontOptions = TYPING_FONTS.map(f => 
        `<option value="${f.id}">${f.name}</option>`
    ).join("");

    // 파비콘 프리셋 옵션 HTML 생성
    const faviconPresetOptions = FAVICON_PRESETS.map(p => 
        `<option value="${p.id}">${p.name}</option>`
    ).join("");

    const settingsHtml = `
    <div id="st-customizer-settings" class="extension_settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>ST Customizer</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                
                <!-- 파비콘 설정 -->
                <div class="stc-section">
                    <h5>파비콘 (Favicon)</h5>
                    <div class="stc-row">
                        <label>활성화</label>
                        <input type="checkbox" id="stc-favicon-enabled">
                        <label class="stc-onoff-btn" for="stc-favicon-enabled"></label>
                    </div>
                    <div class="stc-row">
                        <label>프리셋</label>
                        <select id="stc-favicon-preset" class="text_pole">
                            ${faviconPresetOptions}
                        </select>
                    </div>
                    <div class="stc-row" id="stc-favicon-custom-row">
                        <label>커스텀 아이콘</label>
                        <input type="file" id="stc-favicon-file" accept="image/*" style="display:none;">
                        <button class="stc-file-btn menu_button" id="stc-favicon-upload">업로드</button>
                        <button class="stc-reset-btn menu_button" id="stc-favicon-reset">초기화</button>
                    </div>
                    <div class="stc-preview" id="stc-favicon-preview" style="display:none;">
                        <img id="stc-favicon-preview-img" src="" alt="preview">
                        <span class="stc-preview-text" id="stc-favicon-name"></span>
                    </div>
                </div>

                <!-- 탭 타이틀 설정 -->
                <div class="stc-section">
                    <h5>탭 타이틀 (Tab Title)</h5>
                    <div class="stc-row">
                        <label>활성화</label>
                        <input type="checkbox" id="stc-tabtitle-enabled">
                        <label class="stc-onoff-btn" for="stc-tabtitle-enabled"></label>
                    </div>
                    <div class="stc-row">
                        <label>커스텀 타이틀</label>
                        <input type="text" id="stc-tabtitle-text" class="text_pole" placeholder="SillyTavern">
                    </div>
                </div>

                <!-- 알림음 설정 -->
                <div class="stc-section">
                    <h5>알림음 (Notification)</h5>
                    <div class="stc-row">
                        <label>활성화</label>
                        <input type="checkbox" id="stc-notification-enabled">
                        <label class="stc-onoff-btn" for="stc-notification-enabled"></label>
                    </div>
                    <div class="stc-info">
                        <small>활성화 시 ST 기본 알림음이 재생됩니다.</small>
                    </div>
                    <div class="stc-row">
                        <label>커스텀 사운드</label>
                        <input type="checkbox" id="stc-notification-custom-toggle">
                        <label class="stc-onoff-btn" for="stc-notification-custom-toggle"></label>
                    </div>
                    <div class="stc-row" id="stc-notification-upload-row" style="display:none;">
                        <label>파일 업로드</label>
                        <input type="file" id="stc-notification-file" accept="audio/*" style="display:none;">
                        <button class="stc-file-btn menu_button" id="stc-notification-upload">업로드</button>
                        <button class="stc-reset-btn menu_button" id="stc-notification-reset">초기화</button>
                    </div>
                    <div class="stc-preview" id="stc-notification-preview" style="display:none;">
                        <span>♪</span>
                        <span class="stc-preview-text" id="stc-notification-name"></span>
                    </div>
                    <div class="stc-row">
                        <label>테스트</label>
                        <button class="stc-test-btn menu_button" id="stc-notification-test">▶ 재생</button>
                    </div>
                    <div class="stc-row">
                        <label>볼륨</label>
                        <input type="range" id="stc-notification-volume" min="0" max="1" step="0.1" value="0.5">
                        <span id="stc-notification-volume-label">50%</span>
                    </div>
                    <div class="stc-row">
                        <label>백그라운드에서만</label>
                        <input type="checkbox" id="stc-notification-background">
                        <label class="stc-onoff-btn" for="stc-notification-background"></label>
                    </div>
                </div>

                <!-- 입력창 플레이스홀더 -->
                <div class="stc-section">
                    <h5>입력창 텍스트 (Placeholder)</h5>
                    <div class="stc-row">
                        <label>활성화</label>
                        <input type="checkbox" id="stc-placeholder-enabled">
                        <label class="stc-onoff-btn" for="stc-placeholder-enabled"></label>
                    </div>
                    <div class="stc-row">
                        <label>커스텀 텍스트</label>
                        <input type="text" id="stc-placeholder-text" class="text_pole" placeholder="Type a message...">
                    </div>
                </div>

                <!-- 타이핑 인디케이터 -->
                <div class="stc-section">
                    <h5>타이핑 인디케이터 (Typing Indicator)</h5>
                    <div class="stc-row">
                        <label>활성화</label>
                        <input type="checkbox" id="stc-typing-enabled">
                        <label class="stc-onoff-btn" for="stc-typing-enabled"></label>
                    </div>
                    <div class="stc-row">
                        <label>디자인 스타일</label>
                        <select id="stc-typing-design" class="text_pole">
                            ${typingDesignOptions}
                        </select>
                    </div>
                    
                    <!-- 커스텀 스타일 설정 (custom 선택시만 표시) -->
                    <div id="stc-custom-indicator-settings" style="display:none;">
                        <div class="stc-subsection">
                            <div class="stc-row">
                                <label>이미지 타입</label>
                                <select id="stc-custom-image-type" class="text_pole">
                                    <option value="none">없음</option>
                                    <option value="upload">파일 업로드</option>
                                    <option value="url">URL 입력</option>
                                </select>
                            </div>
                            <div class="stc-row" id="stc-custom-upload-row" style="display:none;">
                                <label>이미지 파일</label>
                                <input type="file" id="stc-custom-image-file" accept="image/*,.gif,.webp" style="display:none;">
                                <button class="stc-file-btn menu_button" id="stc-custom-image-upload">업로드</button>
                                <button class="stc-reset-btn menu_button" id="stc-custom-image-reset">초기화</button>
                            </div>
                            <div class="stc-row" id="stc-custom-url-row" style="display:none;">
                                <label>이미지 URL</label>
                                <input type="text" id="stc-custom-image-url" class="text_pole" placeholder="https://...">
                            </div>
                            <div class="stc-preview" id="stc-custom-image-preview" style="display:none;">
                                <img id="stc-custom-image-preview-img" src="" alt="preview" style="width:50px;height:50px;object-fit:contain;">
                                <span class="stc-preview-text" id="stc-custom-image-name"></span>
                            </div>
                            <div class="stc-row" id="stc-custom-size-row" style="display:none;">
                                <label>이미지 크기</label>
                                <input type="range" id="stc-custom-image-size" min="30" max="100" step="5" value="50">
                                <span id="stc-custom-image-size-label">50px</span>
                            </div>
                            <div class="stc-row">
                                <label>컨테이너 색상</label>
                                <input type="color" id="stc-custom-container-color" value="#ffd1dc">
                                <span id="stc-custom-container-color-label" class="stc-color-label">#ffd1dc</span>
                            </div>
                            <div class="stc-row">
                                <label>글자 색상</label>
                                <input type="color" id="stc-custom-text-color" value="#6b4c5a">
                                <span id="stc-custom-text-color-label" class="stc-color-label">#6b4c5a</span>
                            </div>
                            <div class="stc-row">
                                <label>표시 텍스트</label>
                                <textarea id="stc-custom-text" class="text_pole" rows="3" placeholder="{{char}} 입력중..."></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 기본 스타일 텍스트 설정 (custom 외 스타일) -->
                    <div id="stc-default-text-row">
                        <div class="stc-row">
                            <label>표시 텍스트</label>
                            <textarea id="stc-typing-text" class="text_pole" rows="3" placeholder="{{char}} 입력중..."></textarea>
                        </div>
                        <div class="stc-row">
                            <label>폰트</label>
                            <select id="stc-typing-font" class="text_pole">
                                ${typingFontOptions}
                            </select>
                        </div>
                        <div class="stc-row">
                            <label>타이핑 효과</label>
                            <button type="button" id="stc-typewriter-effect" class="stc-toggle-btn">ON</button>
                        </div>
                    </div>
                    
                    <div class="stc-info">
                        <small>{{char}}는 캐릭터 이름으로 자동 치환됩니다.</small>
                    </div>
                    <div class="stc-preview" id="stc-typing-preview">
                        <span class="stc-preview-text">미리보기:</span>
                        <div id="stc-typing-preview-box" class="stc-typing-preview-box"></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `;

    // 설정 패널에 추가
    $("#extensions_settings").append(settingsHtml);

    // 이벤트 바인딩
    bindEvents();

    // UI 상태 업데이트
    updateUI();
}

/**
 * UI 상태 업데이트
 */
export function updateUI() {
    const s = state.settings;

    // 파비콘
    $("#stc-favicon-enabled").prop("checked", s.favicon.enabled);
    const faviconPresetId = s.favicon.presetId || "custom";
    $("#stc-favicon-preset").val(faviconPresetId);
    
    // 커스텀일 때만 업로드 행 표시
    const isFaviconCustom = faviconPresetId === "custom";
    $("#stc-favicon-custom-row").toggle(isFaviconCustom);
    
    if (s.favicon.customIcon) {
        $("#stc-favicon-preview").show();
        $("#stc-favicon-preview-img").attr("src", s.favicon.customIcon);
        $("#stc-favicon-name").text(s.favicon.iconName || "Custom Icon");
    } else {
        $("#stc-favicon-preview").hide();
    }

    // 탭 타이틀
    $("#stc-tabtitle-enabled").prop("checked", s.tabTitle.enabled);
    $("#stc-tabtitle-text").val(s.tabTitle.customTitle);

    // 알림음
    $("#stc-notification-enabled").prop("checked", s.notification.enabled);
    $("#stc-notification-custom-toggle").prop("checked", s.notification.useCustomSound);
    $("#stc-notification-upload-row").toggle(s.notification.useCustomSound);
    $("#stc-notification-volume").val(s.notification.volume);
    $("#stc-notification-volume-label").text(Math.round(s.notification.volume * 100) + "%");
    $("#stc-notification-background").prop("checked", s.notification.playOnlyBackground);
    
    if (s.notification.useCustomSound && s.notification.customSound) {
        $("#stc-notification-preview").show();
        $("#stc-notification-name").text(s.notification.soundName || "Custom Sound");
    } else {
        $("#stc-notification-preview").hide();
    }

    // 플레이스홀더
    $("#stc-placeholder-enabled").prop("checked", s.placeholder.enabled);
    $("#stc-placeholder-text").val(s.placeholder.customText);

    // 타이핑 인디케이터
    $("#stc-typing-enabled").prop("checked", s.typingIndicator.enabled);
    $("#stc-typing-design").val(s.typingIndicator.designStyle || "fade");
    $("#stc-typing-text").val(s.typingIndicator.customText || "{{char}} 입력중...");
    $("#stc-typing-font").val(s.typingIndicator.fontFamily || "default");
    
    // 타이핑 효과 버튼 상태
    const typewriterOn = s.typingIndicator.typewriterEffect !== false;
    $("#stc-typewriter-effect").text(typewriterOn ? "ON" : "OFF");
    $("#stc-typewriter-effect").toggleClass("active", typewriterOn);
    
    // 커스텀 인디케이터 설정
    const isCustom = s.typingIndicator.designStyle === "custom";
    $("#stc-custom-indicator-settings").toggle(isCustom);
    $("#stc-default-text-row").toggle(!isCustom);
    
    if (s.customIndicator) {
        const hasImage = s.customIndicator.imageType !== "none";
        $("#stc-custom-image-type").val(s.customIndicator.imageType || "none");
        $("#stc-custom-upload-row").toggle(s.customIndicator.imageType === "upload");
        $("#stc-custom-url-row").toggle(s.customIndicator.imageType === "url");
        $("#stc-custom-size-row").toggle(hasImage);
        $("#stc-custom-image-url").val(s.customIndicator.imageData && s.customIndicator.imageType === "url" ? s.customIndicator.imageData : "");
        $("#stc-custom-container-color").val(s.customIndicator.containerColor || "#ffd1dc");
        $("#stc-custom-container-color-label").text(s.customIndicator.containerColor || "#ffd1dc");
        $("#stc-custom-text-color").val(s.customIndicator.textColor || "#6b4c5a");
        $("#stc-custom-text-color-label").text(s.customIndicator.textColor || "#6b4c5a");
        $("#stc-custom-text").val(s.customIndicator.customText || "{{char}} 입력중...");
        $("#stc-custom-image-size").val(s.customIndicator.imageSize || 50);
        $("#stc-custom-image-size-label").text((s.customIndicator.imageSize || 50) + "px");
        
        // 이미지 미리보기
        if (s.customIndicator.imageData && s.customIndicator.imageType !== "none") {
            const size = s.customIndicator.imageSize || 50;
            $("#stc-custom-image-preview").show();
            $("#stc-custom-image-preview-img").attr("src", s.customIndicator.imageData).css({ width: size + "px", height: size + "px" });
            $("#stc-custom-image-name").text(s.customIndicator.imageName || "Custom Image");
        } else {
            $("#stc-custom-image-preview").hide();
        }
    }
    
    updateTypingPreview();
}

/**
 * 타이핑 미리보기 업데이트
 */
function updateTypingPreview() {
    const design = state.settings.typingIndicator.designStyle || "fade";
    const previewBox = document.getElementById("stc-typing-preview-box");
    
    if (!previewBox) return;
    
    // 폰트 설정 가져오기
    const fontId = state.settings.typingIndicator.fontFamily || "default";
    const fontFamily = fontId === "default" ? "inherit" : `'${fontId}', sans-serif`;
    
    // 커스텀 스타일인 경우
    if (design === "custom") {
        const customSettings = state.settings.customIndicator || {};
        const template = customSettings.customText || "{{char}} 입력중...";
        const text = template.replace(/\{\{char\}\}/gi, "캐릭터").replace(/\n/g, '<br>');
        previewBox.innerHTML = getCustomPreviewContent(text);
        previewBox.setAttribute("data-style", "custom");
        // 폰트 적용 - .stc-text와 .stc-typewriter-char 모두
        const textEls = previewBox.querySelectorAll(".stc-text, .stc-typewriter-char");
        textEls.forEach(el => el.style.setProperty('font-family', fontFamily, 'important'));
        return;
    }
    
    // 일반 스타일
    const template = state.settings.typingIndicator.customText || "{{char}} 입력중...";
    const text = template.replace(/\{\{char\}\}/gi, "캐릭터").replace(/\n/g, '<br>');
    previewBox.innerHTML = getPreviewContent(design, text);
    previewBox.setAttribute("data-style", design);
    
    // 폰트 적용 - .stc-text와 .stc-typewriter-char 모두
    const textEls = previewBox.querySelectorAll(".stc-text, .stc-typewriter-char");
    textEls.forEach(el => el.style.setProperty('font-family', fontFamily, 'important'));
}

/**
 * 커스텀 스타일 미리보기 콘텐츠
 */
function getCustomPreviewContent(text) {
    const customSettings = state.settings.customIndicator || {};
    const containerColor = customSettings.containerColor || "#ffd1dc";
    const textColor = customSettings.textColor || "#6b4c5a";
    const imageData = customSettings.imageData;
    const imageType = customSettings.imageType || "none";
    const imageSize = customSettings.imageSize || 50;
    
    const hasImage = imageType !== "none" && imageData;
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    
    const imageHtml = hasImage 
        ? `<img src="${imageData}" class="stc-gif-outside" alt="custom" style="width:${imageSize}px;height:${imageSize}px;object-fit:contain;">`
        : "";
    
    // 이미지가 있고 타이핑 효과가 켜져있을 때만 적용
    const textHtml = (hasImage && typewriterEnabled) ? createTypewriterText(text) : text;
    const textClass = (hasImage && typewriterEnabled) ? "stc-text stc-typewriter" : "stc-text";
    
    return `
        <div class="stc-typing-custom" style="display:flex;align-items:center;gap:10px;">
            ${imageHtml}
            <div class="stc-content-box" style="background:${containerColor};padding:8px 16px;border-radius:15px;border:1px solid rgba(0,0,0,0.1);">
                <span class="${textClass}" style="color:${textColor} !important;font-size:13px;">${textHtml}</span>
            </div>
        </div>
    `;
}

/**
 * 미리보기용 콘텐츠 생성
 */
function getPreviewContent(style, text) {
    // GIF 스타일인지 확인
    if (TYPING_GIFS[style]) {
        return getGifPreviewContent(style, text);
    }

    // 타이핑 효과 설정 확인
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    const textHtml = typewriterEnabled ? createTypewriterText(text) : text;
    const textClass = typewriterEnabled ? "stc-text stc-typewriter" : "stc-text";

    switch (style) {
        case "fade":
            return `<div class="stc-typing-fade"><span class="stc-text">${text}</span></div>`;
        case "heart":
            return `<div class="stc-typing-heart"><span class="stc-heart">♥</span><span class="stc-heart">♥</span><span class="stc-heart">♥</span><span class="stc-text">${text}</span></div>`;
        case "star":
            return `<div class="stc-typing-star"><span class="stc-star">★</span><span class="stc-star">★</span><span class="stc-star">★</span><span class="stc-text">${text}</span></div>`;
        // ✨ NEW 디테일 스타일 - 타이핑 효과 적용
        case "crystal":
            return `<div class="stc-typing-crystal"><span class="stc-crystal-deco">✧</span><span class="${textClass}">${textHtml}</span><span class="stc-crystal-deco">✧</span></div>`;
        case "crystal-pink":
            return `<div class="stc-typing-crystal stc-typing-crystal-pink"><span class="stc-crystal-deco">✧</span><span class="${textClass}">${textHtml}</span><span class="stc-crystal-deco">✧</span></div>`;
        case "crystal-mint":
            return `<div class="stc-typing-crystal stc-typing-crystal-mint"><span class="stc-crystal-deco">✧</span><span class="${textClass}">${textHtml}</span><span class="stc-crystal-deco">✧</span></div>`;
        case "crystal-purple":
            return `<div class="stc-typing-crystal stc-typing-crystal-purple"><span class="stc-crystal-deco">✧</span><span class="${textClass}">${textHtml}</span><span class="stc-crystal-deco">✧</span></div>`;
        case "crystal-gold":
            return `<div class="stc-typing-crystal stc-typing-crystal-gold"><span class="stc-crystal-deco">✧</span><span class="${textClass}">${textHtml}</span><span class="stc-crystal-deco">✧</span></div>`;
        case "heartbeat":
            return `<div class="stc-typing-heartbeat"><div class="stc-heartbeat-line"><svg viewBox="0 0 200 50" class="stc-heartbeat-svg"><path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/></svg></div><span class="stc-text">${text}</span></div>`;
        case "heartbeat-gray":
            return `<div class="stc-typing-heartbeat stc-typing-heartbeat-gray"><div class="stc-heartbeat-line"><svg viewBox="0 0 200 50" class="stc-heartbeat-svg"><path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/></svg></div><span class="stc-text">${text}</span></div>`;
        case "heartbeat-white":
            return `<div class="stc-typing-heartbeat stc-typing-heartbeat-white"><div class="stc-heartbeat-line"><svg viewBox="0 0 200 50" class="stc-heartbeat-svg"><path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/></svg></div><span class="stc-text">${text}</span></div>`;
        case "heartbeat-lavender":
            return `<div class="stc-typing-heartbeat stc-typing-heartbeat-lavender"><div class="stc-heartbeat-line"><svg viewBox="0 0 200 50" class="stc-heartbeat-svg"><path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/></svg></div><span class="stc-text">${text}</span></div>`;
        // 픽셀PC - 타이핑 효과 적용
        case "pixelpc":
            return `<div class="stc-typing-pixelpc"><div class="stc-pixelpc"></div><div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div></div>`;
        case "pixelpc-pink":
            return `<div class="stc-typing-pixelpc stc-typing-pixelpc-pink"><div class="stc-pixelpc"></div><div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div></div>`;
        case "pixelpc-purple":
            return `<div class="stc-typing-pixelpc stc-typing-pixelpc-purple"><div class="stc-pixelpc"></div><div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div></div>`;
        case "pixelpc-black":
            return `<div class="stc-typing-pixelpc stc-typing-pixelpc-black"><div class="stc-pixelpc"></div><div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div></div>`;
        default:
            return `<span class="stc-text">${text}</span>`;
    }
}

/**
 * GIF 스타일 미리보기 콘텐츠 (타이핑 효과 적용)
 */
function getGifPreviewContent(style, text) {
    const gifUrl = TYPING_GIFS[style];
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    const textHtml = typewriterEnabled ? createTypewriterText(text) : text;
    const textClass = typewriterEnabled ? "stc-text stc-typewriter" : "stc-text";
    
    return `
        <div class="stc-typing-${style}">
            <img src="${gifUrl}" class="stc-gif-outside" alt="${style}">
            <div class="stc-content-box">
                <span class="${textClass}">${textHtml}</span>
            </div>
        </div>
    `;
}

/**
 * 이벤트 바인딩
 */
function bindEvents() {
    // 파비콘
    $("#stc-favicon-enabled").on("change", function () {
        updateSetting("favicon", "enabled", $(this).prop("checked"));
        window.dispatchEvent(new CustomEvent("stc-favicon-update"));
    });

    // 파비콘 프리셋 선택
    $("#stc-favicon-preset").on("change", function () {
        const presetId = $(this).val();
        const preset = FAVICON_PRESETS.find(p => p.id === presetId);
        
        state.settings.favicon.presetId = presetId;
        
        if (preset && preset.data) {
            // 프리셋 선택 시 해당 아이콘 적용
            state.settings.favicon.customIcon = preset.data;
            state.settings.favicon.iconName = preset.name;
            $("#stc-favicon-preview").show();
            $("#stc-favicon-preview-img").attr("src", preset.data);
            $("#stc-favicon-name").text(preset.name);
            $("#stc-favicon-custom-row").hide();
        } else {
            // 커스텀 선택 시 업로드 행 표시
            $("#stc-favicon-custom-row").show();
            // 기존 커스텀 아이콘이 없으면 프리뷰 숨김
            if (!state.settings.favicon.customIcon || presetId === "custom") {
                // 커스텀으로 전환 시 기존 프리셋 아이콘 제거
                const wasPreset = FAVICON_PRESETS.find(p => p.id !== "custom" && p.data === state.settings.favicon.customIcon);
                if (wasPreset) {
                    state.settings.favicon.customIcon = null;
                    state.settings.favicon.iconName = "";
                    $("#stc-favicon-preview").hide();
                }
            }
        }
        
        saveSettings();
        window.dispatchEvent(new CustomEvent("stc-favicon-update"));
    });

    $("#stc-favicon-upload").on("click", () => $("#stc-favicon-file").click());
    $("#stc-favicon-file").on("change", async function () {
        const file = this.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            state.settings.favicon.customIcon = base64;
            state.settings.favicon.iconName = file.name;
            state.settings.favicon.presetId = "custom";
            saveSettings();
            $("#stc-favicon-preview").show();
            $("#stc-favicon-preview-img").attr("src", base64);
            $("#stc-favicon-name").text(file.name);
            window.dispatchEvent(new CustomEvent("stc-favicon-update"));
        }
    });

    $("#stc-favicon-reset").on("click", () => {
        state.settings.favicon.customIcon = null;
        state.settings.favicon.iconName = "";
        state.settings.favicon.presetId = "custom";
        saveSettings();
        $("#stc-favicon-preview").hide();
        window.dispatchEvent(new CustomEvent("stc-favicon-update"));
    });

    // 탭 타이틀
    $("#stc-tabtitle-enabled").on("change", function () {
        updateSetting("tabTitle", "enabled", $(this).prop("checked"));
        window.dispatchEvent(new CustomEvent("stc-tabtitle-update"));
    });

    $("#stc-tabtitle-text").on("input", function () {
        updateSetting("tabTitle", "customTitle", $(this).val());
        window.dispatchEvent(new CustomEvent("stc-tabtitle-update"));
    });

    // 알림음
    $("#stc-notification-enabled").on("change", function () {
        updateSetting("notification", "enabled", $(this).prop("checked"));
    });

    $("#stc-notification-custom-toggle").on("change", function () {
        const useCustom = $(this).prop("checked");
        updateSetting("notification", "useCustomSound", useCustom);
        $("#stc-notification-upload-row").toggle(useCustom);
        if (!useCustom) {
            $("#stc-notification-preview").hide();
        } else if (state.settings.notification.customSound) {
            $("#stc-notification-preview").show();
        }
        window.dispatchEvent(new CustomEvent("stc-notification-update"));
    });

    $("#stc-notification-upload").on("click", () => $("#stc-notification-file").click());
    $("#stc-notification-file").on("change", async function () {
        const file = this.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            state.settings.notification.customSound = base64;
            state.settings.notification.soundName = file.name;
            saveSettings();
            $("#stc-notification-preview").show();
            $("#stc-notification-name").text(file.name);
            window.dispatchEvent(new CustomEvent("stc-notification-update"));
        }
    });

    $("#stc-notification-reset").on("click", () => {
        state.settings.notification.customSound = null;
        state.settings.notification.soundName = "";
        saveSettings();
        $("#stc-notification-preview").hide();
        window.dispatchEvent(new CustomEvent("stc-notification-update"));
    });

    $("#stc-notification-test").on("click", () => {
        window.dispatchEvent(new CustomEvent("stc-notification-test"));
    });

    $("#stc-notification-volume").on("input", function () {
        const vol = parseFloat($(this).val());
        updateSetting("notification", "volume", vol);
        $("#stc-notification-volume-label").text(Math.round(vol * 100) + "%");
    });

    $("#stc-notification-background").on("change", function () {
        updateSetting("notification", "playOnlyBackground", $(this).prop("checked"));
    });

    // 플레이스홀더
    $("#stc-placeholder-enabled").on("change", function () {
        updateSetting("placeholder", "enabled", $(this).prop("checked"));
        window.dispatchEvent(new CustomEvent("stc-placeholder-update"));
    });

    $("#stc-placeholder-text").on("input", function () {
        updateSetting("placeholder", "customText", $(this).val());
        window.dispatchEvent(new CustomEvent("stc-placeholder-update"));
    });

    // 타이핑 인디케이터
    $("#stc-typing-enabled").on("change", function () {
        updateSetting("typingIndicator", "enabled", $(this).prop("checked"));
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });

    $("#stc-typing-design").on("change", function () {
        const design = $(this).val();
        updateSetting("typingIndicator", "designStyle", design);
        
        // 커스텀 설정 표시/숨김
        const isCustom = design === "custom";
        $("#stc-custom-indicator-settings").toggle(isCustom);
        $("#stc-default-text-row").toggle(!isCustom);
        
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });

    $("#stc-typing-text").on("input", function () {
        updateSetting("typingIndicator", "customText", $(this).val());
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });

    $("#stc-typing-font").on("change", function () {
        updateSetting("typingIndicator", "fontFamily", $(this).val());
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });

    $("#stc-typewriter-effect").on("click", function () {
        const currentState = state.settings.typingIndicator.typewriterEffect !== false;
        const newState = !currentState;
        updateSetting("typingIndicator", "typewriterEffect", newState);
        $(this).text(newState ? "ON" : "OFF");
        $(this).toggleClass("active", newState);
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    // 커스텀 인디케이터 이벤트
    $("#stc-custom-image-type").on("change", function () {
        const type = $(this).val();
        updateSetting("customIndicator", "imageType", type);
        $("#stc-custom-upload-row").toggle(type === "upload");
        $("#stc-custom-url-row").toggle(type === "url");
        $("#stc-custom-size-row").toggle(type !== "none");
        
        if (type === "none") {
            state.settings.customIndicator.imageData = null;
            state.settings.customIndicator.imageName = "";
            saveSettings();
            $("#stc-custom-image-preview").hide();
        }
        
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-image-upload").on("click", () => $("#stc-custom-image-file").click());
    $("#stc-custom-image-file").on("change", async function () {
        const file = this.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            state.settings.customIndicator.imageData = base64;
            state.settings.customIndicator.imageName = file.name;
            saveSettings();
            const size = state.settings.customIndicator.imageSize || 50;
            $("#stc-custom-image-preview").show();
            $("#stc-custom-image-preview-img").attr("src", base64).css({ width: size + "px", height: size + "px" });
            $("#stc-custom-image-name").text(file.name);
            $("#stc-custom-size-row").show();
            updateTypingPreview();
            window.dispatchEvent(new CustomEvent("stc-typing-update"));
        }
    });
    
    $("#stc-custom-image-reset").on("click", () => {
        state.settings.customIndicator.imageData = null;
        state.settings.customIndicator.imageName = "";
        saveSettings();
        $("#stc-custom-image-preview").hide();
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-image-url").on("input", function () {
        const url = $(this).val();
        state.settings.customIndicator.imageData = url;
        state.settings.customIndicator.imageName = "URL Image";
        saveSettings();
        
        if (url) {
            const size = state.settings.customIndicator.imageSize || 50;
            $("#stc-custom-image-preview").show();
            $("#stc-custom-image-preview-img").attr("src", url).css({ width: size + "px", height: size + "px" });
            $("#stc-custom-image-name").text("URL Image");
            $("#stc-custom-size-row").show();
        } else {
            $("#stc-custom-image-preview").hide();
        }
        
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-image-size").on("input", function () {
        const size = parseInt($(this).val());
        updateSetting("customIndicator", "imageSize", size);
        $("#stc-custom-image-size-label").text(size + "px");
        $("#stc-custom-image-preview-img").css({ width: size + "px", height: size + "px" });
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-container-color").on("input", function () {
        const color = $(this).val();
        updateSetting("customIndicator", "containerColor", color);
        $("#stc-custom-container-color-label").text(color);
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-text-color").on("input", function () {
        const color = $(this).val();
        updateSetting("customIndicator", "textColor", color);
        $("#stc-custom-text-color-label").text(color);
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
    
    $("#stc-custom-text").on("input", function () {
        updateSetting("customIndicator", "customText", $(this).val());
        updateTypingPreview();
        window.dispatchEvent(new CustomEvent("stc-typing-update"));
    });
}
