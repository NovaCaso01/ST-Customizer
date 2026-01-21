export const EXTENSION_NAME = "ST-Customizer";

export const DEFAULT_SETTINGS = {
    // 파비콘 설정
    favicon: {
        enabled: false,
        presetId: "custom", // 프리셋 ID (custom이면 직접 업로드)
        customIcon: null, // Base64 데이터
        iconName: "",
    },

    // 탭 타이틀 설정
    tabTitle: {
        enabled: false,
        customTitle: "SillyTavern",
    },

    // 알림음 설정 (ST 기본 알림 활성화 + 커스텀 사운드 옵션)
    notification: {
        enabled: false,
        useCustomSound: false, // false면 ST 기본 알림음, true면 커스텀
        customSound: null, // Base64 데이터
        soundName: "",
        volume: 0.5,
        playOnlyBackground: true,
    },

    // 입력창 플레이스홀더 설정
    placeholder: {
        enabled: false,
        customText: "Type a message...",
    },

    // 타이핑 인디케이터 설정
    typingIndicator: {
        enabled: false,
        designStyle: "fade", // 디자인 스타일
        customText: "{{char}} 입력중...", // 사용자 정의 텍스트 ({{char}}는 캐릭터 이름으로 치환)
        fontFamily: "default", // 폰트 선택
        typewriterEffect: true, // 타이핑 효과 on/off
    },

    // 커스텀 타이핑 인디케이터 설정
    customIndicator: {
        enabled: false,
        imageType: "none", // none, upload, url
        imageData: null, // base64 데이터 또는 URL
        imageName: "",
        imageSize: 50, // 이미지 크기 (px)
        containerColor: "#ffd1dc", // 컨테이너 배경색
        textColor: "#6b4c5a", // 텍스트 색상
        customText: "{{char}} 입력중...",
    },
};

// 타이핑 인디케이터 폰트 목록
export const TYPING_FONTS = [
    { id: "default", name: "기본 (시스템)" },
    { id: "Paperlogy", name: "페이퍼로지" },
    { id: "Ridibatang", name: "리디바탕" },
    { id: "BookkMyungjo", name: "부크크명조" },
    { id: "OngleipKonkon", name: "온글잎 콘콘체" },
    { id: "OmuDaye", name: "오뮤 다예쁨체" },
    { id: "SchoolSafetyWing", name: "학교안심 날개" },
    { id: "SchoolSafetyPictureDiary", name: "학교안심 그림일기" },
    { id: "IsYun", name: "이서윤체" },
    { id: "RoundedFixedsys", name: "둥근모꼴" },
    { id: "ThinRounded", name: "얇은둥근모" },
    { id: "Mulmaru", name: "물마루" },
];

// 타이핑 인디케이터 디자인 스타일
export const TYPING_DESIGNS = [
    // 커스텀
    { id: "custom", name: "Custom" },
    // 기본 스타일
    { id: "fade", name: "페이드" },
    { id: "heart", name: "하트" },
    { id: "star", name: "별" },
    // 크리스탈
    { id: "crystal", name: "크리스탈 (블루)" },
    { id: "crystal-pink", name: "크리스탈 (핑크)" },
    { id: "crystal-mint", name: "크리스탈 (민트)" },
    { id: "crystal-purple", name: "크리스탈 (퍼플)" },
    { id: "crystal-gold", name: "크리스탈 (골드)" },
    // 하트비트
    { id: "heartbeat", name: "하트비트 (핑크)" },
    { id: "heartbeat-gray", name: "하트비트 (그레이)" },
    { id: "heartbeat-white", name: "하트비트 (화이트)" },
    { id: "heartbeat-lavender", name: "하트비트 (라벤더)" },
    // 산리오
    { id: "cinnamoroll", name: "시나모롤" },
    { id: "mymelody", name: "마이멜로디" },
    { id: "hellokitty", name: "헬로키티" },
    { id: "hellokittypencil", name: "챠미키티" },
    // 피카츄
    { id: "pikachu", name: "피카츄" },
    // 고양이
    { id: "blackcat", name: "검은 고양이" },
    { id: "whitecat", name: "하트 쫓는 흰 고양이" },
    { id: "whitecatcute", name: "춤추는 흰 고양이" },
    { id: "siamesecat", name: "샴 고양이" },
    { id: "blackpinkcat", name: "핑크 리본 검은 고양이" },
    { id: "cushioncat", name: "쿠션 고양이" },
    { id: "puddingcat", name: "푸딩 고양이" },
    { id: "breadcat", name: "반죽하는 고양이" },
    { id: "laptopcat", name: "노트북 보는 고양이" },
    // 토끼
    { id: "whiterabbit", name: "흰 토끼" },
    { id: "brownrabbit", name: "브라운 토끼" },
    // 판다
    { id: "pinkpanda", name: "핑크 판다" },
    // 기타
    { id: "chocomilk", name: "초코 우유" },
    { id: "strawberrymilk", name: "딸기 우유" },
    { id: "pinkribbon", name: "핑크 리본" },
    // 픽셀 컴퓨터
    { id: "pixelpc", name: "픽셀 컴퓨터 (레트로)" },
    { id: "pixelpc-pink", name: "픽셀 컴퓨터 (핑크)" },
    { id: "pixelpc-purple", name: "픽셀 컴퓨터 (퍼플)" },
    { id: "pixelpc-black", name: "픽셀 컴퓨터 (블랙)" },
];

// GIF URL 매핑 (postimg 호스팅)
export const TYPING_GIFS = {
    cinnamoroll: "https://i.postimg.cc/wTBvVVtN/cinnamoroll-sanrio-character-cinnamoroll.gif",
    pikachu: "https://i.postimg.cc/RV0FRR3Q/run-pikachu.gif",
    blackcat: "https://i.postimg.cc/TYPw99y5/16bit-80s.gif",
    whitecat: "https://i.postimg.cc/HsLx22Jy/cute-cat.gif",
    hellokitty: "https://i.postimg.cc/HsLx22Jw/hello-kitty-pixel-art.gif",
    whiterabbit: "https://i.postimg.cc/yYNdPPJh/psybirdb1oom.gif",
    brownrabbit: "https://i.postimg.cc/ncLzkksv/kawaii-sip.gif",
    siamesecat: "https://i.postimg.cc/KvYzNNKL/cat-black.gif",
    // NEW GIF 🎀
    cushioncat: "https://i.postimg.cc/9XTWWn62/A-cat-sitting-on-a-brown-cushion.gif",
    blackpinkcat: "https://i.postimg.cc/wxJ66GCq/black-pink-cat.webp",
    breadcat: "https://i.postimg.cc/HW5pphqd/Cat-Kneading-Bread.gif",
    laptopcat: "https://i.postimg.cc/WzMjXdGr/Cat-looking-at-a-pink-laptop.gif",
    chocomilk: "https://i.postimg.cc/1R699jkt/choco-milk.gif",
    mymelody: "https://i.postimg.cc/sfSVVNkv/mymelody.gif",
    pinkpanda: "https://i.postimg.cc/dQdqqxbV/pink-panda.gif",
    hellokittypencil: "https://i.postimg.cc/c1YssbpJ/pink-pencil-hello-kity.webp",
    pinkribbon: "https://i.postimg.cc/wxJ66GCp/pink-ribbon.gif",
    puddingcat: "https://i.postimg.cc/tRPXXMK1/pudding-cat.gif",
    strawberrymilk: "https://i.postimg.cc/Y2gpps5k/strawberry-milk.gif",
    whitecatcute: "https://i.postimg.cc/66R99mk8/white-cat.gif",
};

// 아이콘 맵핑
export const ICONS = {
    favicon: "fa-image",
    tabTitle: "fa-heading",
    notification: "fa-bell",
    placeholder: "fa-keyboard",
    typingIndicator: "fa-comment-dots",
};

// 파비콘 프리셋
export const FAVICON_PRESETS = [
    { 
        id: "custom", 
        name: "Custom",
        data: null 
    },
    { 
        id: "pixel-heart", 
        name: "픽셀 하트",
        data: "data:image/x-icon;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA38f/AP/1/wAmJSYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMwAAAAAAAAMRMAAAAAAAMRETAAAAAAMREREwAAAAMhERERMAAAMiERERETAAMSEREREREwAxIRERERETADIhERERERMAMSIhMxEREwADEiMAMREwAAAzMAADMwAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP5/AAD8PwAA+B8AAPAPAADgBwAAwAMAAIABAACAAQAAgAEAAIABAADBgwAA48cAAP//AAD//wAA"
    },
    { 
        id: "Wings(white)", 
        name: "날개(화이트)",
        data: "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD83NYAAAAAAJ5xbgD///8A9qSXAPm+tABZY1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERYREREREREWEgBSAREREREDMzUAURERFTMzMCM1EREQMyMwIyIRERAzJQVDAFEREDMyJDMzBREQMzMzMzMwEREDMzMzAiURFkAzMzMwURERYVAzMzM1EREREVAzMzAREREREVAzMBEREREREVAEERERERERERERERERERERERHgfwAAgB8AAIAPAAAABwAAAAcAAAADAAAAAQAAAAEAAIADAACAAwAAwAEAAPABAAD8AQAA/wEAAP/DAAD//wAA"
    },
    { 
        id: "Wings(pink)", 
        name: "날개(핑크)",
        data: "data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAC+vswAAAAAAOjo/ADU1PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAAAAAAAAQEBAQEBAQEAAAADAAMDAAAAAQEBAQEBAAMCAgICAwADAwABAQEBAAMCAgICAgMAAgIDAAEBAQADAgIAAAIDAAIAAwABAQEAAwICAAMDAAACAAAAAAEBAAMCAgIAAAACAgICAAAAAQADAgICAgICAgICAgIDAAEBAAICAgICAgICAAADAAABAQAAAgICAgICAgIDAAABAQEBAAAAAgICAgICAgIDAAEBAQEBAAAAAgICAgICAwABAQEBAQEBAAAAAwICAgMAAQEBAQEBAQEBAAAAAwMAAAEBAQEBAQEBAQEBAAAAAAEBAQEBAQEBAQEBAQEBAQEBAeB/AACAHwAAgA8AAAAHAAAABwAAAAMAAAABAAAAAQAAgAEAAIADAADAAQAA8AEAAPwBAAD/AQAA/8MAAP//AAA="
    },
    { 
        id: "Rabbit", 
        name: "토끼",
        data: "data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAADm5uYAAAAAAFxcXAD///8A3s/8ACsrKwClefwAv57/AEpKSgDt7e0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEFAQEBAQEBAQEBAQEBAQEFAQMDAwMDAwMDAwMBAQEFAQAGBwMDAwMDAwYHAwEBBQEJCQEBAwYGAwEBAwMBAQUBCQkBAQMDAwMBAQMDAQEFAQkJAwMDAwMDAwMDAwEBBQEACQMDAwMDAwMDAwMBAQUBAAkDAwMDAwMDAwMDAQEBBQEJAwMDAwMDAwMDAQEBAQEFAQMBAQEBAQEDAQEBAQEFAQMEAQEBAQEBBAMBAQEFAQMGAwEBAQEBAQMGAwEBBQEDBwMBAQEBAQEDBwMBAQUBAwcDAQEBAQEBAwcDAQEBCAEDAwEBAQEBAQMDAQEBAQECAQEBAQEBAQEBAQEBAcAHAACAAwAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAgAMAAMAHAACDwwAAA8EAAAPBAAADwQAAg8MAAMfnAAA="
    },
    { 
        id: "Pinguin", 
        name: "펭귄",
        data: "data:image/x-icon;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAA5foAAAAAAP+EAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERESIiIhEREREiMzMzIhEREiMzMzMyIRESIzMzMzIhEhIjMzMzMiEiIiMzMzMyIiEiIzMzMzIiESIjMzMzMiIREiIzMzMiIRESEiAAAiEhERISIAACISEREiIiIiIiIRERIiIiIiIREREiIiIiIhERERIiIiIhERERERIiIRERH4HwAA4AcAAMADAADAAwAAQAIAAAAAAACAAQAAgAEAAMADAADAAwAAwAMAAMADAADgBwAA4AcAAPAPAAD8PwAA"
    },
];
