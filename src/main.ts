// import { invoke } from "@tauri-apps/api/core";

import { DropdownMenu } from "./ts/Ui/DropdownMenu";

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
    k0.addButton(k1 => { k1.addPrefixIconA("back.svg", 0.9); k1.addTitleA("Move Up Directory"); k1.addKeybindA("Ctrl + Up Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIconA("undo.svg", 0.9); k1.addTitleA("Back"); k1.addKeybindA("Ctrl + Left Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIconA("redo.svg", 0.9); k1.addTitleA("Forward"); k1.addKeybindA("Ctrl + Right Arrow"); k1.disable(); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("refresh.svg", 0.8); k1.addTitleA("Refresh"); k1.addKeybindA("Ctrl + R"); });
    k0.addButton(k1 => { k1.addPrefixIconA("hard-refresh.svg", 0.8); k1.addTitleA("Hard Refresh"); k1.addKeybindA("Ctrl + Shift + R"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("save.svg", 1.05); k1.addTitleA("Import/Export Data"); });
    k0.addButton(k1 => { k1.addPrefixIconA("settings.svg", 0.8); k1.addTitleA("Settings"); k1.addKeybindA("Ctrl + P"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("cross.svg", 0.8); k1.addTitleA("Exit"); });
});

new DropdownMenu(k0 => {
    k0.setPosition(400, 80);
    k0.addButton(k1 => { k1.addPrefixIconA("back.svg", 0.9); k1.addTitleA("Move Up Directory"); k1.addKeybindA("Ctrl + Up Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIconA("undo.svg", 0.9); k1.addTitleA("Back"); k1.addKeybindA("Ctrl + Left Arrow"); k1.disable(); });
    k0.addButton(k1 => { k1.addPrefixIconA("redo.svg", 0.9); k1.addTitleA("Forward"); k1.addKeybindA("Ctrl + Right Arrow"); k1.disable(); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("refresh.svg", 0.8); k1.addTitleA("Refresh"); k1.addKeybindA("Ctrl + R"); });
    k0.addButton(k1 => { k1.addPrefixIconA("hard-refresh.svg", 0.8); k1.addTitleA("Hard Refresh"); k1.addKeybindA("Ctrl + Shift + R"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("save.svg", 1.05); k1.addTitleA("Import/Export Data"); });
    k0.addButton(k1 => { k1.addPrefixIconA("settings.svg", 0.8); k1.addTitleA("Settings"); k1.addKeybindA("Ctrl + P"); });
    k0.addDivider();
    k0.addButton(k1 => { k1.addPrefixIconA("cross.svg", 0.8); k1.addTitleA("Exit"); });
});