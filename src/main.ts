// import { invoke } from "@tauri-apps/api/core";

import { DropdownMenu, DropdownMenuButton } from "./ts/Ui/DropdownMenu";

// let greetInputEl: HTMLInputElement | null;
// let greetMsgEl: HTMLElement | null;

// async function greet() {
//   if (greetMsgEl && greetInputEl) {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     greetMsgEl.textContent = await invoke("greet", {
//       name: greetInputEl.value,
//     });
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });
// });

document.documentElement.oncontextmenu = e => e.preventDefault();
document.body.oncontextmenu = e => e.preventDefault();

new DropdownMenu(k0 => {
    k0.setPosition(40, 40);
    k0.addButton(k1 => { k1.addPrefixIcon2("back.svg", 0.9); k1.addTitle2("Move Up Directory"); k1.addKeybind2("Ctrl + Up Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIcon2("undo.svg", 0.9); k1.addTitle2("Back"); k1.addKeybind2("Ctrl + Left Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIcon2("redo.svg", 0.9); k1.addTitle2("Forward"); k1.addKeybind2("Ctrl + Right Arrow"); k1.disable(); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIcon2("refresh.svg", 0.8); k1.addTitle2("Refresh"); k1.addKeybind2("Ctrl + R"); });
    k0.addButton(k1 => { k1.addPrefixIcon2("hard-refresh.svg", 0.8); k1.addTitle2("Hard Refresh"); k1.addKeybind2("Ctrl + Shift + R"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIcon2("save.svg", 1.05); k1.addTitle2("Import/Export Data"); });
    k0.addButton(k1 => { k1.addPrefixIcon2("settings.svg", 0.8); k1.addTitle2("Settings"); k1.addKeybind2("Ctrl + P"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIcon2("cross.svg", 0.8); k1.addTitle2("Exit"); });
});

new DropdownMenu(k0 => {
    k0.setPosition(400, 80);
    k0.setWidth(150);
    k0.addButton(k1 => { k1.addPrefixIcon2("sort-down.svg", 0.8); k1.addTitle2("Sort By"); k1.addChildMenu(k2 => {
        k2.setPosition2(k1);
        k2.setWidth(150);
        k2.addButton(k3 => { k3.addRadioToggle().enable(); k3.addTitle2("Name") });
        k2.addButton(k3 => { k3.addRadioToggle(); k3.addTitle2("Date") });
        k2.addButton(k3 => { k3.addRadioToggle(); k3.addTitle2("Size") });
        k2.addDivider();
        k2.addButton(k3 => { k3.addRadioToggle().enable(); k3.addTitle2("Ascending") });
        k2.addButton(k3 => { k3.addRadioToggle(); k3.addTitle2("Descending") });
    }); });
    k0.addButton(k1 => { k1.addPrefixIcon2("filter.svg", 0.8); k1.addTitle2("View"); k1.addChildMenu(k2 => {
        k2.setPosition2(k1);
        k2.setWidth(150);
        k2.addButton(k3 => { k3.addRadioToggle().enable(); k3.addTitle2("Tiles") });
        k2.addButton(k3 => { k3.addRadioToggle(); k3.addTitle2("List") });
        k2.addButton(k3 => { k3.addRadioToggle(); k3.addTitle2("Compact") });
    }); });
    let testMenu = (k1: DropdownMenuButton, k2: DropdownMenu) => {
        k2.setPosition2(k1);
        k2.setWidth(150);
        k2.addButton(k3 => { k3.addTitle2("Test"); k3.addChildMenu(k4 => { testMenu(k3, k4); }) });
        k2.addButton(k3 => { k3.addTitle2("Test"); k3.addChildMenu(k4 => { testMenu(k3, k4); }) });
        k2.addButton(k3 => { k3.addTitle2("Test"); k3.addChildMenu(k4 => { testMenu(k3, k4); }) });
        k2.addButton(k3 => { k3.addTitle2("Test"); k3.addChildMenu(k4 => { testMenu(k3, k4); }) });
        k2.addButton(k3 => { k3.addTitle2("Test"); k3.addChildMenu(k4 => { testMenu(k3, k4); }) });
    }
    k0.addButton(k1 => { k1.addTitle2("Test"); k1.addChildMenu(k2 => testMenu(k1, k2)); });
});