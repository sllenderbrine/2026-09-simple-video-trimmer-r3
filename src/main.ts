// import { invoke } from "@tauri-apps/api/core";

import { DropdownMenuElement } from "./ts/Ui/DropdownMenu";

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

let menu = DropdownMenuElement.create((menu, k) => menu.append(
    k.decorativeButton("back.svg/0.9", "Move Up Directory", "Ctrl + Up Arrow").setEnabled(false),
    k.decorativeButton("refresh.svg/0.8", "Refresh", "Ctrl + R"),
    k.decorativeButton("hard-refresh.svg/0.8", "Hard Refresh", "Ctrl + Shift + R"),
    k.divider(),
    k.decorativeButton("save.svg/1.05", "Import/Export Data"),
    k.decorativeButton("settings.svg/0.8", "Settings", "Ctrl + P"),
));
document.body.appendChild(menu.containerEl);
menu.containerEl.style = "position:absolute;left:40px;top:40px;";