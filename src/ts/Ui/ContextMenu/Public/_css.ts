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
            background-color: rgb(34, 36, 36);
            color: rgb(97, 100, 101);
        }
    }

    .dropdownmenu {
        container-type: size;
        position: absolute;
        left: 20px;
        top: 20px;
        user-select: none;
        border-radius: 8px;
    }

    .dropdownmenu-backgroundcontent {
        position: absolute;
        border-radius: 8px;
        width: 100cqw;
        height: 100cqh;
        user-select: none;
        overflow: hidden;
    }

    .dropdownmenu-background {
        position: absolute;
        border-radius: 8px;
        width: 100cqw;
        height: 100cqh;
        pointer-events: none;
        user-select: none;
    }

    .dropdownmenu-overlay {
        position: absolute;
        border-radius: 8px;
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
        background-color: var(--bg2);
        width: 4px;
        height: 50%;
        right: 6px;
        border-radius: 4px;
        top: 0px;
        z-index: 2;
        opacity: 1;
        transition: opacity 0.2s ease, filter 0.2s ease;
    }

    .dropdownmenu[data-scrollbar-visible="false"] .dropdownmenu-scrollbar {
        opacity: 0.2;
    }

    .dropdownmenu-scrollbar:hover {
        filter: brightness(1.5);
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
`);
