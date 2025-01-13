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
if (currentSettings.get("coloredWeaponSlots")) { __coloredWeaponSlots = "checked"; }
if (currentSettings.get("pingMeter")) { __pingMeter = "checked";}
const mainElementMap = new Map<string, string>([
    [`gameUI-Main`, `<div id="gameUI-Main" class="mainContent">
                    <input type="checkbox" id="coloredWeaponSlots" name="coloredWeaponSlots" value="0"  ${__coloredWeaponSlots}> <label for="coloredWeaponSlots" >Coloured Weapon Slots</label><br>
                    <input type="checkbox" id="pingMeter" name="pingMeter" value="0"  ${__pingMeter}> <label for="pingMeter">Ping Meter</label><br>
                </div>`],
    [`version-Main`, `<div id="version-Main" class="mainContent">Version: ${currentVer}</div>`]
])
const actsMainElementMap = new Map<string, CallableFunction>([
    ['gameUI', () => {
        const coloredWeaponSlotsELEMENT = (document.getElementById("coloredWeaponSlots") as HTMLInputElement).checked
        const pingMeterELEMENT = (document.getElementById("pingMeter") as HTMLInputElement).checked
        let weaponSlots = 0;
        let pingMeter = 0;
        if (coloredWeaponSlotsELEMENT) { weaponSlots = 1 }
        if (pingMeterELEMENT) { pingMeter = 1 }
        currentSettings.set("coloredWeaponSlots", weaponSlots)
        currentSettings.set("pingMeter", pingMeter)
    }],
    ['version', () => { }]
])
const settingsForChange = ["gameUI", "version"]
settingsForChange.forEach(setting => {
    document.getElementById(`${setting}-Btn`)?.addEventListener("click", () => {
        settingsMainContentFrame!.innerHTML = mainElementMap.get(`${setting}-Main`)!
        currentUIElementSelected = setting
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