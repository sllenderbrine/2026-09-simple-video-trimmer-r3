import { ContextMenu, CtxmButton, CtxmDivider } from "./ts/Ui/ContextMenu";

document.documentElement.oncontextmenu = e => e.preventDefault();
document.body.oncontextmenu = e => e.preventDefault();

let menu = new ContextMenu();
let btn0 = new CtxmButton(menu);
btn0.setTitle("Test");
new CtxmDivider(menu);
let btn1 = new CtxmButton(menu);
btn1.setTitle("Test 1234");
let btn2 = new CtxmButton(menu);
btn2.setTitle("Test");
new CtxmDivider(menu);
let btn3 = new CtxmButton(menu);
btn3.setTitle("Test");