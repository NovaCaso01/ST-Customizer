import { eventSource, event_types, name2, scrollChatToBottom } from "../../../../../script.js";
import { getContext } from "../../../../extensions.js";
import { state } from "./state.js";
import { TYPING_GIFS } from "./constants.js";

/**
 * 타이핑 인디케이터 모듈 초기화
 */
export function initTypingIndicator() {
    // 이벤트 리스너
    window.addEventListener("stc-typing-update", () => {
        const existing = document.getElementById("stc_typing_indicator");
        if (existing) {
            updateIndicatorContent(existing);
        }
    });

    // 생성 이벤트 바인딩
    const showEvents = [
        event_types.GENERATION_STARTED,
        event_types.GENERATION_AFTER_COMMANDS,
    ];
    const hideEvents = [
        event_types.GENERATION_STOPPED,
        event_types.GENERATION_ENDED,
        event_types.CHAT_CHANGED,
    ];

    showEvents.forEach(e => eventSource.on(e, showTypingIndicator));
    hideEvents.forEach(e => eventSource.on(e, hideTypingIndicator));

    console.log("[ST-Customizer] Typing indicator module initialized");
}

/**
 * 현재 캐릭터 이름 가져오기
 */
function getCharacterName() {
    try {
        if (name2) return name2;
        const context = getContext();
        return context?.name2 || context?.characters?.[context?.characterId]?.name || "...";
    } catch (e) {
        return "...";
    }
}

/**
 * 사용자 정의 텍스트 가져오기 ({{char}} 치환, 줄바꿈 -> <br>)
 */
function getCustomText() {
    const template = state.settings?.typingIndicator?.customText || "{{char}} 입력중...";
    const charName = getCharacterName();
    return template.replace(/\{\{char\}\}/gi, charName).replace(/\n/g, '<br>');
}

/**
 * 현재 디자인 스타일 가져오기
 */
function getDesignStyle() {
    return state.settings?.typingIndicator?.designStyle || "fade";
}

/**
 * 디자인별 HTML 콘텐츠 생성
 */
function getDesignContent(style, text) {
    // 커스텀 스타일
    if (style === "custom") {
        return getCustomDesignContent();
    }
    
    // GIF 스타일인지 확인
    if (TYPING_GIFS[style]) {
        return getGifDesignContent(style, text);
    }

    // 타이핑 효과 설정 확인
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    const textHtml = typewriterEnabled ? createTypewriterText(text) : text;
    const textClass = typewriterEnabled ? "stc-text stc-typewriter" : "stc-text";

    // 기본 스타일
    switch (style) {
        case "fade":
            return `
                <div class="stc-typing-fade">
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "heart":
            return `
                <div class="stc-typing-heart">
                    <span class="stc-heart">♥</span>
                    <span class="stc-heart">♥</span>
                    <span class="stc-heart">♥</span>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "star":
            return `
                <div class="stc-typing-star">
                    <span class="stc-star">★</span>
                    <span class="stc-star">★</span>
                    <span class="stc-star">★</span>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        // ✨ NEW 디테일 스타일들 - 타이핑 효과 적용
        case "crystal":
            return `
                <div class="stc-typing-crystal">
                    <span class="stc-crystal-deco">✧</span>
                    <span class="${textClass}">${textHtml}</span>
                    <span class="stc-crystal-deco">✧</span>
                </div>
            `;
        case "crystal-pink":
            return `
                <div class="stc-typing-crystal stc-typing-crystal-pink">
                    <span class="stc-crystal-deco">✧</span>
                    <span class="${textClass}">${textHtml}</span>
                    <span class="stc-crystal-deco">✧</span>
                </div>
            `;
        case "crystal-mint":
            return `
                <div class="stc-typing-crystal stc-typing-crystal-mint">
                    <span class="stc-crystal-deco">✧</span>
                    <span class="${textClass}">${textHtml}</span>
                    <span class="stc-crystal-deco">✧</span>
                </div>
            `;
        case "crystal-purple":
            return `
                <div class="stc-typing-crystal stc-typing-crystal-purple">
                    <span class="stc-crystal-deco">✧</span>
                    <span class="${textClass}">${textHtml}</span>
                    <span class="stc-crystal-deco">✧</span>
                </div>
            `;
        case "crystal-gold":
            return `
                <div class="stc-typing-crystal stc-typing-crystal-gold">
                    <span class="stc-crystal-deco">✧</span>
                    <span class="${textClass}">${textHtml}</span>
                    <span class="stc-crystal-deco">✧</span>
                </div>
            `;
        case "heartbeat":
            return `
                <div class="stc-typing-heartbeat">
                    <div class="stc-heartbeat-line">
                        <svg viewBox="0 0 200 50" class="stc-heartbeat-svg">
                            <path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/>
                        </svg>
                    </div>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "heartbeat-gray":
            return `
                <div class="stc-typing-heartbeat stc-typing-heartbeat-gray">
                    <div class="stc-heartbeat-line">
                        <svg viewBox="0 0 200 50" class="stc-heartbeat-svg">
                            <path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/>
                        </svg>
                    </div>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "heartbeat-white":
            return `
                <div class="stc-typing-heartbeat stc-typing-heartbeat-white">
                    <div class="stc-heartbeat-line">
                        <svg viewBox="0 0 200 50" class="stc-heartbeat-svg">
                            <path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/>
                        </svg>
                    </div>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "heartbeat-lavender":
            return `
                <div class="stc-typing-heartbeat stc-typing-heartbeat-lavender">
                    <div class="stc-heartbeat-line">
                        <svg viewBox="0 0 200 50" class="stc-heartbeat-svg">
                            <path class="stc-heartbeat-path" d="M0,25 L30,25 L40,10 L50,40 L60,5 L70,35 L80,25 L90,25 L90,25 C90,17 96,10 104,10 C108,10 112,12 115,16 C118,12 122,10 126,10 C134,10 140,17 140,25 C140,35 115,50 115,50 C115,50 90,35 90,25 L140,25 L150,25 L160,10 L170,40 L180,15 L190,30 L200,25"/>
                        </svg>
                    </div>
                    <span class="stc-text">${text}</span>
                </div>
            `;
        case "pixelpc":
            return `
                <div class="stc-typing-pixelpc">
                    <div class="stc-pixelpc"></div>
                    <div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div>
                </div>
            `;
        case "pixelpc-pink":
            return `
                <div class="stc-typing-pixelpc stc-typing-pixelpc-pink">
                    <div class="stc-pixelpc"></div>
                    <div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div>
                </div>
            `;
        case "pixelpc-purple":
            return `
                <div class="stc-typing-pixelpc stc-typing-pixelpc-purple">
                    <div class="stc-pixelpc"></div>
                    <div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div>
                </div>
            `;
        case "pixelpc-black":
            return `
                <div class="stc-typing-pixelpc stc-typing-pixelpc-black">
                    <div class="stc-pixelpc"></div>
                    <div class="stc-pixel-textbox"><span class="${textClass}">${textHtml}</span></div>
                </div>
            `;
        default:
            return `<span class="stc-text">${text}</span>`;
    }
}

/**
 * 타자기 효과 텍스트 생성 (<br> 태그 보존, 유니코드 지원)
 */
function createTypewriterText(text) {
    // <br> 태그를 기준으로 분리
    const parts = text.split(/<br\s*\/?>/gi);
    let charIndex = 0;
    
    return parts.map((part) => {
        // 유니코드 문자를 제대로 분리하기 위해 Array.from 또는 스프레드 연산자 사용
        const chars = [...part].map((char) => {
            const delay = charIndex * 80;
            charIndex++;
            return `<span class="stc-typewriter-char" style="animation-delay:${delay}ms">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
        return chars;
    }).join('<br>');
}

/**
 * 커스텀 스타일 콘텐츠 생성
 */
function getCustomDesignContent() {
    const customSettings = state.settings?.customIndicator || {};
    const template = customSettings.customText || "{{char}} 입력중...";
    const charName = getCharacterName();
    const text = template.replace(/\{\{char\}\}/gi, charName).replace(/\n/g, '<br>');
    
    const containerColor = customSettings.containerColor || "#ffd1dc";
    const textColor = customSettings.textColor || "#6b4c5a";
    const imageData = customSettings.imageData;
    const imageType = customSettings.imageType || "none";
    const imageSize = customSettings.imageSize || 50;
    
    const hasImage = imageType !== "none" && imageData;
    
    // 타이핑 효과 설정 확인
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    
    const imageHtml = hasImage 
        ? `<img src="${imageData}" class="stc-gif-outside" alt="custom" style="width:${imageSize}px !important;height:${imageSize}px !important;">`
        : "";
    
    // 이미지가 있고 타이핑 효과가 켜져있을 때만 적용
    const textHtml = (hasImage && typewriterEnabled) ? createTypewriterText(text) : text;
    const textClass = (hasImage && typewriterEnabled) ? "stc-text stc-typewriter" : "stc-text";
    
    return `
        <div class="stc-typing-custom">
            ${imageHtml}
            <div class="stc-content-box" style="background:${containerColor} !important;border:1px solid rgba(0,0,0,0.1) !important;">
                <span class="${textClass}" style="color:${textColor} !important;">${textHtml}</span>
            </div>
        </div>
    `;
}

/**
 * GIF 스타일 콘텐츠 생성 - 이미지 분리 레이아웃 (데코 없음)
 */
function getGifDesignContent(style, text) {
    const gifUrl = TYPING_GIFS[style];
    
    // 큰 이미지 스타일
    const largeImageStyles = ["breadcat", "laptopcat"];
    const imgClass = largeImageStyles.includes(style) ? "stc-gif-outside stc-gif-large" : "stc-gif-outside";
    
    // 타이핑 효과 설정 확인
    const typewriterEnabled = state.settings?.typingIndicator?.typewriterEffect !== false;
    const typewriterText = typewriterEnabled ? createTypewriterText(text) : text;
    const textClass = typewriterEnabled ? "stc-text stc-typewriter" : "stc-text";

    return `
        <div class="stc-typing-${style}">
            <img src="${gifUrl}" class="${imgClass}" alt="${style}">
            <div class="stc-content-box">
                <span class="${textClass}">${typewriterText}</span>
            </div>
        </div>
    `;
}

/**
 * 현재 폰트 가져오기
 */
function getFontFamily() {
    const fontId = state.settings?.typingIndicator?.fontFamily || "default";
    if (fontId === "default") {
        return "inherit";
    }
    return `'${fontId}', sans-serif`;
}

/**
 * 인디케이터 콘텐츠 업데이트
 */
function updateIndicatorContent(element) {
    const style = getDesignStyle();
    const text = getCustomText();
    element.innerHTML = getDesignContent(style, text);
    element.setAttribute("data-style", style);
    
    // 폰트 적용 - !important로 강제 적용
    const fontFamily = getFontFamily();
    // .stc-text와 타이핑 효과의 .stc-typewriter-char 모두에 적용
    const textElements = element.querySelectorAll(".stc-text, .stc-typewriter-char");
    textElements.forEach(el => {
        el.style.setProperty('font-family', fontFamily, 'important');
    });
}

/**
 * 타이핑 인디케이터 표시
 */
function showTypingIndicator(type, options, dryRun) {
    // dryRun이면 무시 (실제 생성이 아님)
    if (dryRun === true) {
        return;
    }
    
    const settings = state.settings?.typingIndicator;

    if (!settings?.enabled) {
        return;
    }
    
    // quiet, impersonate 타입은 제외
    const noIndicatorTypes = ["quiet", "impersonate"];
    if (typeof type === "string" && noIndicatorTypes.includes(type)) {
        return;
    }

    // 기존 인디케이터가 있으면 업데이트
    const existingIndicator = document.getElementById("stc_typing_indicator");
    const chat = document.getElementById("chat");
    
    if (existingIndicator) {
        updateIndicatorContent(existingIndicator);
        // 기존 인디케이터가 채팅 끝에 있는지 확인, 아니면 재배치
        if (chat && existingIndicator.parentNode === chat && chat.lastElementChild !== existingIndicator) {
            chat.appendChild(existingIndicator);
        }
        return;
    }

    // 새 인디케이터 생성 - ST의 typing_indicator 클래스 사용
    const typingIndicator = document.createElement("div");
    typingIndicator.id = "stc_typing_indicator";
    typingIndicator.classList.add("typing_indicator");  // ST 기본 클래스 사용!
    updateIndicatorContent(typingIndicator);
    $(typingIndicator).hide();

    // 공식 ST Extension-TypingIndicator 방식: 채팅 끝에 appendChild
    if (chat) {
        // 새로 send한 경우 유저 메시지가 DOM에 추가되기를 기다림
        setTimeout(() => {
            // 이미 다른 인디케이터가 추가되었으면 무시
            if (document.getElementById("stc_typing_indicator")) {
                return;
            }
            
            // 스크롤 상태 확인 (추가 전)
            const wasChatScrolledDown = Math.ceil(chat.scrollTop + chat.clientHeight) >= chat.scrollHeight - 50;
            
            chat.appendChild(typingIndicator);
            $(typingIndicator).show();
            
            // 스크롤이 맨 아래였으면 인디케이터가 보이도록 스크롤
            if (wasChatScrolledDown) {
                // 여러 방법으로 스크롤 시도 (모바일 호환성)
                requestAnimationFrame(() => {
                    chat.scrollTop = chat.scrollHeight;
                    // scrollChatToBottom도 호출 (ST 내장 함수)
                    scrollChatToBottom();
                });
            }
        }, 100);
    }
}

/**
 * 타이핑 인디케이터 숨기기
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById("stc_typing_indicator");
    if (typingIndicator) {
        $(typingIndicator).hide(() => typingIndicator.remove());
    }
}

/**
 * 현재 타이핑 텍스트 가져오기 (외부용)
 */
export function getCurrentTypingText() {
    return getCustomText();
}
