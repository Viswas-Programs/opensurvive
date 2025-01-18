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
if (currentSettings.get("coloredWeaponSlots")) { __coloredWeaponSlots = "checked"; }
if (currentSettings.get("pingMeter")) { __pingMeter = "checked"; }
if (currentSettings.get("healthMeter")) { __healthMeter = "checked"; }
if (currentSettings.get("adrenalineMeter")) { __adrenalineMeter = "checked"; }
if (currentSettings.get("positionMeter")) { __positionMeter = "checked"; }
const mainElementMap = new Map<string, string>([
    [`gameUI-Main`, `<div id="gameUI-Main" class="mainContent">
                    <input type="checkbox" id="coloredWeaponSlots" name="coloredWeaponSlots" value="0"  ${__coloredWeaponSlots}> <label for="coloredWeaponSlots" >Coloured Weapon Slots</label><br>
                    <input type="checkbox" id="pingMeter" name="pingMeter" value="0"  ${__pingMeter}> <label for="pingMeter">Ping Meter</label><br>
                    <input type="checkbox" id="healthMeter" name="healthMeter" value="0"  ${__healthMeter}> <label for="healthMeter">Health Meter</label><br>
                    <input type="checkbox" id="adrenalineMeter" name="adrenalineMeter" value="0"  ${__adrenalineMeter}> <label for="adrenalineMeter">Adrenaline Meter</label><br>
                    <input type="checkbox" id="positionMeter" name="positionMeter" value="0"  ${__positionMeter}> <label for="positionMeter">Show Coordinates</label><br>
                </div>`],
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
    ['version', () => { }]
])
const settingsForChange = ["gameUI", "version"]
settingsForChange.forEach(setting => {
    document.getElementById(`${setting}-Btn`)?.addEventListener("click", () => {
        settingsMainContentFrame!.innerHTML = mainElementMap.get(`${setting}-Main`)!
        currentUIElementSelected = setting
        for (let ii = 0; ii < settingsForChange.length; ii++) {
            document.getElementById(`${settingsForChange[ii]}-Btn`)!.style.background = "inherit";
        }
        document.getElementById(`${setting}-Btn`)!.style.background = "rgba(65, 65, 65, 0.9)";
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