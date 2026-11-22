import { ContextMenu } from "./ts/Ui/ContextMenu/ContextMenu";
import { CtxmDivider } from "./ts/Ui/ContextMenu/CtxmDivider";

document.documentElement.oncontextmenu = e => e.preventDefault();
document.body.oncontextmenu = e => e.preventDefault();

let menu = new ContextMenu();
new CtxmDivider(menu);
new CtxmDivider(menu);
new CtxmDivider(menu);
new CtxmDivider(menu);