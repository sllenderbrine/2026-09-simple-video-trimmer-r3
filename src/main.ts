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

let menu = DropdownMenuElement.create((menu, k) => menu.append(
    k.decorativeButton("", "Option A".repeat(10), "Ctrl + S"),
    k.decorativeButton("", "Option B"),
    k.decorativeButton("", "Option C"),
    k.divider(),
    k.decorativeButton("", "Option D"),
    k.decorativeButton("", "Option E"),
    k.decorativeButton("", "Option F"),
));
document.body.appendChild(menu.containerEl);
menu.containerEl.style = "position:absolute;left:40px;top:40px;";