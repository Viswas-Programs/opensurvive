import { KeyBind } from "./constants";
import { parseSettingsStuff } from "./utils"

const ctrlPanelMainElement = document.getElementById("control-panel")
const settingsMainContentFrame = document.getElementById("main-content")
const currentVer = localStorage.getItem("version")
let currentUIElementSelected = "";
document.getElementById("volume-icon")?.addEventListener("click", () => { ctrlPanelMainElement!.style.display = "block" })
document.getElementById("settings-close")?.addEventListener("click", () => { ctrlPanelMainElement!.style.display = "none" })
const currentSettings = new Map<string, number>(parseSettingsStuff())
let __coloredWeaponSlots = "";
let __pingMeter = "";
let __healthMeter = "";
let __adrenalineMeter = "";
let __positionMeter = "";
let oldWindowKeyDown: CallableFunction;
export function setWindowKeyDown(func: CallableFunction) { oldWindowKeyDown = func; window.onkeydown = (<any>func) }
if (currentSettings.get("coloredWeaponSlots")) { __coloredWeaponSlots = "checked"; }
if (currentSettings.get("pingMeter")) { __pingMeter = "checked"; }
if (currentSettings.get("healthMeter")) { __healthMeter = "checked"; }
if (currentSettings.get("adrenalineMeter")) { __adrenalineMeter = "checked"; }
if (currentSettings.get("positionMeter")) { __positionMeter = "checked"; }
let keybindEle = `<div id="keybinds-Main" class="mainContent">`
const strings = ["Exit Menu", "Hide HUD", "World Map", "Hide Map", "Big Map", "Move right", "Move up", "Move left", "Move down", "Interact", "Melee", "Last used weapon", "Reload Weapon", "Cancel"]
for (let ii = 0; ii < strings.length; ii++) {
    let keyb = (KeyBind.get(ii)!)
    if (keyb.length == 1) keyb = keyb.toUpperCase()
    keybindEle += `
    <div id="${Array.from(KeyBind)[ii][0]}FRAME" class="keybindMainFrame"> <div id="${Array.from(KeyBind)[ii][0]}TXT" class="keybindFrame">${strings[ii]}</div> <div id="${Array.from(KeyBind)[ii][0]}" class="keybind">${keyb}</div> </div>
    `
}
keybindEle += `</div>`
const tempKeybinds = KeyBind
function reverseParseKeybinds() {
    const tempKbArr = Array.from(tempKeybinds);
    console.log(tempKbArr)
    let kbStr = ""
    for (let ii = 0; ii < tempKbArr.length; ii++) {
        let txt = ""
        if (ii != tempKbArr.length -1) txt=";"
        kbStr += `${ii}:${tempKbArr[ii][1]}${txt}`
    }
    localStorage.setItem("keybinds", kbStr)
    window.onkeydown = (<any>oldWindowKeyDown);
}
const mainElementMap = new Map<string, string>([
    [`gameUI-Main`, `<div id="gameUI-Main" class="mainContent">
                    <input type="checkbox" id="coloredWeaponSlots" name="coloredWeaponSlots" value="0"  ${__coloredWeaponSlots}> <label for="coloredWeaponSlots" >Coloured Weapon Slots</label><br>
                    <input type="checkbox" id="pingMeter" name="pingMeter" value="0"  ${__pingMeter}> <label for="pingMeter">Ping Meter</label><br>
                    <input type="checkbox" id="healthMeter" name="healthMeter" value="0"  ${__healthMeter}> <label for="healthMeter">Health Meter</label><br>
                    <input type="checkbox" id="adrenalineMeter" name="adrenalineMeter" value="0"  ${__adrenalineMeter}> <label for="adrenalineMeter">Adrenaline Meter</label><br>
                    <input type="checkbox" id="positionMeter" name="positionMeter" value="0"  ${__positionMeter}> <label for="positionMeter">Show Coordinates</label><br>
                </div>`],
    ['keybinds-Main', keybindEle],
    [`version-Main`, `<div id="version-Main" class="mainContent">Version: ${currentVer}</div>`]
])
const actsMainElementMap = new Map<string, CallableFunction>([
    ['gameUI', () => {
        const checkboxElIds = ["coloredWeaponSlots", "pingMeter", "healthMeter", "adrenalineMeter", "positionMeter"]
        const checkboxElCheckmarked = []
        for (let ii = 0; ii < checkboxElIds.length; ii++) {
            const id= checkboxElIds[ii]
            console.log((<HTMLInputElement>document.getElementById(id)))
            checkboxElCheckmarked.push(Number((<HTMLInputElement>document.getElementById(id)).checked));
        }
        for (let ii = 0; ii < checkboxElIds.length; ii++) {
            currentSettings.set(checkboxElIds[ii], checkboxElCheckmarked[ii] )
        }
    }],
    ['keybinds', reverseParseKeybinds],
    ['version', () => { }]
])
const postActionScripts = new Map<string, CallableFunction>([
    ["keybinds", () => {
        const keybindElements = Array.from(document.getElementsByClassName("keybind"))
        keybindElements.forEach((keybindElement) => {
            const keybindEle = <HTMLElement>keybindElement;
            keybindEle.addEventListener("click", () => {
                const id = keybindEle.id
                keybindEle.style.background = "rgba(50, 50, 70, 0.7)";
                window.onkeydown = (ev) => {
                    let k = ev.key
                    if (ev.key.length == 1) k=ev.key.toUpperCase()
                    keybindEle.textContent = ev.key;
                    keybindEle.style.background = "rgba(80,80,80,0.8)";
                    tempKeybinds.set(Number(id), ev.key)
                }
            })

        })
    }]
]
)
const settingsForChange = ["gameUI", "version", "keybinds"]
settingsForChange.forEach(setting => {
    document.getElementById(`${setting}-Btn`)?.addEventListener("click", () => {
        settingsMainContentFrame!.innerHTML = mainElementMap.get(`${setting}-Main`)!
        currentUIElementSelected = setting
        for (let ii = 0; ii < settingsForChange.length; ii++) {
            document.getElementById(`${settingsForChange[ii]}-Btn`)!.style.background = "inherit";
        }
        document.getElementById(`${setting}-Btn`)!.style.background = "rgba(65, 65, 65, 0.9)";
        if (postActionScripts.get(setting)) (postActionScripts.get(setting)!)()
    })
})

document.getElementById("settings-saveChangesBtn")!.addEventListener("click", () => {
    (actsMainElementMap.get(currentUIElementSelected)!)()
    reverseParserFromSettings()
    ctrlPanelMainElement!.style.display = "none";
})
function reverseParserFromSettings(settingsArr = Array.from(currentSettings)) {
    let settingsString = "``"
    settingsArr.forEach(settingList => {
        settingsString += `${settingList[0]}:${String(settingList[1])};`
    })
    localStorage.setItem("settings", settingsString)
}