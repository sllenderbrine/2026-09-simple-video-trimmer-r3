import { ContextMenu } from "./ts/Ui/ContextMenu";

document.documentElement.oncontextmenu = e => e.preventDefault();
document.body.oncontextmenu = e => e.preventDefault();

document.documentElement.dataset.theme = "dark-flat";

ContextMenu.new(k => {
    k.svgbutton("Move Up Directory", "back", 0.9, "Ctrl + Up Arrow");
    k.svgbutton("Back", "undo", 0.9, "Ctrl + Left Arrow");
    k.svgbutton("Forward", "redo", 0.9, "Ctrl + Right Arrow");
    k.divider();
    k.svgbutton("Refresh", "refresh", 0.8, "Ctrl + R");
    k.svgbutton("Hard Refresh", "hard-refresh", 0.8, "Ctrl + Shift + R");
    k.divider();
    k.svgbutton("Import/Export Data", "save", 1.1, null);
    k.svgbutton("Settings", "settings", 0.9, "Ctrl + P");
    k.divider();
    k.svgbutton("Exit", "cross", 0.85, null);
    k.divider();
    for(let i=0; i<5; i++)
        k.svgbutton("This Is a Very Long Title - 12:00 AM to 11:59 PM - abcdefghijklmnopqrstuvwxyz", "check", 0.85, ["Ctrl + Alt + Shift + Backspace", "Ctrl + E"][i]);
});

// let menu = new ContextMenu();
// let btn0 = new CtxmButton(menu);
// btn0.setTitle("Move Up Directory");
// btn0.setKeybind("Ctrl + Up Arrow");
// new CtxmDivider(menu);
// let btn1 = new CtxmButton(menu);
// btn1.setTitle("Test 1234");
// let btn2 = new CtxmButton(menu);
// btn2.setTitle("Test");
// new CtxmDivider(menu);
// new CtxmDivider(menu);
// new CtxmDivider(menu);
// new CtxmDivider(menu);
// new CtxmDivider(menu);
// new CtxmDivider(menu);
// let btn3 = new CtxmButton(menu);
// btn3.setTitle("Test");

/*
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
*/