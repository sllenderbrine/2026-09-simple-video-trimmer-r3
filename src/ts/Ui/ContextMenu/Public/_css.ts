import { CssUtility } from "../../../Utility";

export const CONTEXTMENU_STYLE = CssUtility.adoptStyle(`
    :root[data-theme="red"] {
        .dropdownmenu-background {
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
        // .dropdownmenu-overlay {
        //     box-shadow: 2px 0px 0px 1px rgba(255, 190, 190, 0.01) inset,
        //         -2px 0px 0px 1px rgba(0, 0, 0, 0.44) inset,
        //         0px 1px 0px 1px rgba(227, 147, 147, 0.2) inset,
        //         0px -1.5px 0px 1px rgba(0, 0, 0, 0.2) inset;
        // }
        .dropdownmenu-prefixicon {
            background-color: rgba(91, 41, 39, 0.5);
            color: rgba(222, 161, 161, 0.53);
        }
    }
        
    :root[data-theme="dark"] {
        .dropdownmenu-background {
            background-color: var(--bg1);
        }
        .dropdownmenu-overlay {
            box-shadow: 2px 0px 0px 1px rgb(35, 35, 35) inset,
                -2px 0px 0px 1px rgb(32, 32, 32) inset,
                0px 1px 0px 1px rgb(97, 97, 97) inset,
                0px -1.5px 0px 1px rgb(24, 24, 24) inset;
        }
        .dropdownmenu-prefixicon {
            background-color: rgb(34, 36, 36);
            color: rgb(97, 100, 101);
        }
    }
        
    :root[data-theme="dark-flat"] {
        .dropdownmenu-background {
            background-color: var(--bg1);
        }
        .dropdownmenu-prefixicon {
            background-color: rgb(32, 32, 33);
            color: rgb(97, 100, 101);
        }
    }

    .dropdownmenu {
        container-type: size;
        position: absolute;
        user-select: none;
        --border-radius: 4px;
        border-radius: var(--border-radius);
        z-index: 20;
    }

    .dropdownmenu-backgroundcontainer {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        user-select: none;
        overflow: hidden;
    }

    .dropdownmenu-background {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .dropdownmenu-overlay {
        position: absolute;
        border-radius: var(--border-radius);
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .dropdownmenu-interactscroll {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
    }

    .dropdownmenu-interact {
        position: absolute;
    }

    .dropdownmenu-contentscroll {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        overflow: hidden;
    }

    .dropdownmenu-content {
        position: absolute;
    }

    .dropdownmenu-divider {
        position: absolute;
        width: 100%;
        height: 0.8px;
        background-color: var(--bg2);
        opacity: 0.5;
    }

    .dropdownmenu-dividertitle {
        position: absolute;
        width: fit-content;
        height: 16px;
        align-content: center;
        font-size: 10px;
        color: var(--bg2);
    }

    .dropdownmenu-dividerright {
        position: absolute;
        height: 0.8px;
        background-color: var(--bg2);
        opacity: 0.5;
    }

    .dropdownmenu-button {
        position: absolute;
        width: 100%;
        height: 24px;
    }

    .dropdownmenu-titlecontainer {
        height: 24px;
        left: 0px;
        top: 0px;
        position: absolute;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
    }

    .dropdownmenu-title {
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

    .dropdownmenu-keybind {
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

    .dropdownmenu-prefixicon {
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

    .dropdownmenu-scrollbar {
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

    .dropdownmenu[data-scrollbar-visible="false"][data-scrollbar-hover="false"] .dropdownmenu-scrollbar {
        opacity: 0.05;
    }

    .dropdownmenu[data-scrollbar-hover="true"] .dropdownmenu-scrollbar {
        opacity: 0.6;
    }

    .dropdownmenu-scrollbarinteract {
        position: absolute;
        width: 13px;
        height: 50%;
        right: 0px;
        top: 0px;
        z-index: 2;
        user-select: none;
        cursor: pointer;
    }

    .dropdownmenu-buttoninteract {
        position: absolute;
        height: 24px;
        padding: 0;
        border: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.05s ease;
    }

    .dropdownmenu-buttoninteract:hover {
        background-color: rgba(255, 255, 255, 0.05);
        outline: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }

    .dropdownmenu-header {
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

    .dropdownmenu[data-header-position="top"] .dropdownmenu-header {
        top: -16px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .dropdownmenu[data-header-position="bottom"] .dropdownmenu-header {
        bottom: -16px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`);
