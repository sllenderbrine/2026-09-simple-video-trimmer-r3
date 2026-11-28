import { CssUtility } from "../../../Utility";

export const CONTEXTMENU_STYLE = CssUtility.adoptStyle(`
    :root[data-theme="red"] {
        .contextmenu-background {
            --stripe1: rgb(42, 4, 18);
            --stripe2: rgb(34, 5, 14);
            background-image: repeating-linear-gradient(
                65deg,
                transparent 0px,
                transparent 4px,
                var(--stripe1) 10px,
                var(--stripe1) 28px,
                transparent 34px,
                transparent 38px,
                transparent 42px,
                var(--stripe2) 48px,
                var(--stripe2) 66px,
                transparent 72px,
                transparent 76px
            );
            scale: 1.5;
            filter: blur(8px);
            background-color: rgb(36, 7, 15);
        }
        // .contextmenu-overlay {
        //     box-shadow: 2px 0px 0px 1px rgba(255, 190, 190, 0.01) inset,
        //         -2px 0px 0px 1px rgba(0, 0, 0, 0.44) inset,
        //         0px 1px 0px 1px rgba(227, 147, 147, 0.2) inset,
        //         0px -1.5px 0px 1px rgba(0, 0, 0, 0.2) inset;
        // }
        .contextmenu-prefixicon {
            background-color: rgba(91, 41, 39, 0.5);
            color: rgba(222, 161, 161, 0.53);
        }
    }
        
    :root[data-theme="dark"] {
        .contextmenu-background {
            background-color: var(--bg1);
        }
        .contextmenu-overlay {
            box-shadow: 2px 0px 0px 1px rgb(35, 35, 35) inset,
                -2px 0px 0px 1px rgb(32, 32, 32) inset,
                0px 1px 0px 1px rgb(97, 97, 97) inset,
                0px -1.5px 0px 1px rgb(24, 24, 24) inset;
        }
        .contextmenu-prefixicon {
            background-color: rgb(34, 36, 36);
            color: rgb(97, 100, 101);
        }
    }
        
    :root[data-theme="dark-flat"] {
        .contextmenu-background {
            background-color: var(--bg1);
        }
        .contextmenu-prefixicon {
            background-color: rgb(32, 32, 33);
            color: rgb(97, 100, 101);
        }
    }

    .contextmenu {
        container-type: size;
        position: absolute;
        user-select: none;
        --border-radius: 4px;
        border-radius: var(--border-radius);
        z-index: 20;
        filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.25));
    }

    .contextmenu-backgroundcontainer {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        user-select: none;
        overflow: hidden;
    }

    .contextmenu-background {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .contextmenu-overlay {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .contextmenu-visual {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .contextmenu-interactscroll {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
    }

    .contextmenu-interact {
        position: absolute;
    }

    .contextmenu-contentscroll {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        overflow: hidden;
    }

    .contextmenu-content {
        position: absolute;
    }

    .contextmenu-divider {
        position: absolute;
        width: 100%;
        height: 0.8px;
        background-color: var(--bg2);
        opacity: 0.5;
    }

    .contextmenu-dividertitle {
        position: absolute;
        width: fit-content;
        height: 16px;
        align-content: center;
        font-size: 10px;
        color: var(--bg2);
    }

    .contextmenu-dividerright {
        position: absolute;
        height: 0.8px;
        background-color: var(--bg2);
        opacity: 0.5;
    }

    .contextmenu-button {
        position: absolute;
        width: 100%;
        height: 24px;
    }

    .contextmenu-titlecontainer {
        height: 24px;
        left: 0px;
        top: 0px;
        position: absolute;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
    }

    .contextmenu-title {
        width: fit-content;
        height: 100%;
        left: 0px;
        top: 0px;
        position: absolute;
        align-content: center;
        text-align: left;
        white-space: nowrap;
        user-select: none;
        pointer-events: none;
        color: var(--text1);
    }

    .contextmenu-keybind {
        height: 24px;
        left: 0px;
        top: 0px;
        position: absolute;
        align-content: center;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
        color: var(--text2);
    }

    .contextmenu-prefixicon {
        position: absolute;
        width: 28px;
        height: 24px;
        user-select: none;
        pointer-events: none;
        text-align: center;
        align-content: center;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .contextmenu-scrollbar {
        position: absolute;
        background-color: rgba(255, 255, 255, 1);
        width: 4px;
        height: 50%;
        right: 6px;
        border-radius: 4px;
        top: 0px;
        opacity: 0.25;
        transition: opacity 0.2s ease;
        pointer-events: none;
        user-select: none;
    }

    .contextmenu[data-scrollbar-visible="false"][data-scrollbar-hover="false"] .contextmenu-scrollbar {
        opacity: 0.05;
    }

    .contextmenu[data-scrollbar-hover="true"] .contextmenu-scrollbar {
        opacity: 0.6;
    }

    .contextmenu-scrollbarinteract {
        position: absolute;
        width: 13px;
        height: 50%;
        right: 0px;
        top: 0px;
        z-index: 2;
        user-select: none;
        cursor: pointer;
    }

    .contextmenu-buttoninteract {
        position: absolute;
        height: 24px;
        padding: 0;
        border: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.05s ease;
    }

    .contextmenu-buttoninteract:hover {
        background-color: rgba(255, 255, 255, 0.05);
        outline: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }

    .contextmenu-header {
        position: absolute;
        width: fit-content;
        height: 16px;
        align-content: center;
        background-color: color-mix(in srgb, var(--bg1) 50%, transparent);
        left: 24px;
        padding: 0px 8px;
        color: color-mix(in srgb, var(--text1) 50%, transparent);
        outline: 2px solid var(--bg1);
        z-index: -1;
    }

    .contextmenu[data-header-position="top"] .contextmenu-header {
        top: -16px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .contextmenu[data-header-position="bottom"] .contextmenu-header {
        bottom: -16px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`);
