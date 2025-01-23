import "dotenv/config";
import { getToken } from "./states";
import { loadoutChange as changeCurrency } from "./utils";
import { cookieExists, getCookieValue } from "cookies-utils";
import { SkinCurrencies, SkinsDecoding, SkinsEncoding } from "./constants";
let currencyA = 0; const token = cookieExists("gave_me_cookies") ? getCookieValue("access_token") : getToken();
const skinsAvailable: string[] = [];
let _skin = "";
if (token != undefined) {
    if (cookieExists("username")) {
        const username = getCookieValue("username")!;
        if (cookieExists("access_token")) {
            const accessToken = getCookieValue("access_token");
            fetch("/api/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, accessToken }) })
                .then(res => {
                    if (res.ok) {
                        fetch("/api/currency", { headers: { "Authorization": "Bearer " + (token as string) } }).then(async res => {
                            if (res.ok) currencyA = (await res.json()).currency;
                        });
                        fetch("/api/getSkins", { headers: { "Authorization": "Bearer " + (token as string) } }).then(async res => {
                            if (res.ok) {
                                _skin = (await res.json()).skinsAvailable;
                            }
                        });
                    }
                });
        }
    }
}
let container2Visible = false;
// Function to show the selected tab content
function showTab(tabName: string) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (const content of tabContents) {
        (content as HTMLElement).style.display = 'none';
    }
    (<HTMLElement>document.getElementById(tabName)).style.display = 'block';

    if (tabName === 'skins') {
        showContainer2();
    } else {
        hideContainer2();
    }
}
document.getElementById("in-use-text")!.textContent = document.getElementById("in-use-text")!.textContent!.replace("%%", localStorage.getItem("playerSkin")!)
// Show loadout container when the loadout button is clicked
const descriptionMapping = new Map<number, string>([
    [0, "Even as a beginner, you can learn to be the best"],
    [1, "Look like the richest man in the lobby (while in reality you're poor to afford the better skins)"],
    [2, "Want to gaze the stars with your fellow islandrs? Be careful or you might disappear into the night sky"],
    [3, "Want to look unique and beautiful like a tulip in the lobby? This is for you!"],
    [4, "Want to be the most menacing person in the lobby decimating every opponent in the field? This one is specifically for you!"]
])
console.log("guh")
console.log(Object.keys(SkinsDecoding).length)
for (let ii = 0; ii < Array.from(SkinsDecoding).length; ii++) {
    let skinPrice = "Free"
    if (SkinCurrencies.get(ii) != 0) { skinPrice = String(SkinCurrencies.get(ii)) }
    let name = (SkinsDecoding.get(ii))!
    name = name?.charAt(0)!.toUpperCase() + name.slice(1, name.length);
    const ele = `
    <div class="card-list__item card">
        <h3 class="card__title">${name}</h3>
        <div class="card__content">
            <div class="card__image-wrapper">
                <div class="card__image">
                    <div id="${SkinsDecoding.get(ii)}" style="display:none;"></div>
                    <img width="100" height="100" src="assets/global-skins/${SkinsDecoding.get(ii)}.svg">
                    </img>
                </div>
            </div>
            <div class="card__text">${descriptionMapping.get(ii)}</div>
        </div>
        <div class="card__button-wrapper">
            <button class="card__button" id="${SkinsDecoding.get(ii)}">${skinPrice} Currency</button>
            <div class="tick-up-skin-rarity">Universal</div>
        </div>
    </div>
    `
    document.getElementById("card-list")!.innerHTML += ele;
}
// Function to hide container2
(<HTMLElement>document.getElementById('loadout')).addEventListener('click', function () {
    const container = document.getElementById('loadout-container');
    const overlay = document.getElementById('overlay');
    (<HTMLElement>container).style.display = 'block';
    (<HTMLElement>overlay).style.display = 'block';
    showTab('skins'); // Show the 'Skins' tab by default
});
// Function to close the loadout container
function closeLoadout() {
    hideContainer2(); // Close container2 if it's open
    const container = document.getElementById('loadout-container');
    const overlay = document.getElementById('overlay');
    (<HTMLElement>container).style.display = 'none';
    (<HTMLElement>overlay).style.display = 'none';
}

// Function to show container2
function showContainer2() {
    const container2 = document.getElementById('container2');
    (<HTMLElement>container2).style.display = 'block';
    container2Visible = true;
}
function hideContainer2() {
    const container2 = document.getElementById('container2');
    (<HTMLElement>container2).style.display = 'none';
    container2Visible = false;
}


    //javascript for skins
document.addEventListener('DOMContentLoaded', () => {
    // Get all the "Select" buttons for skins
    const selectButtons = document.querySelectorAll('.card-list__item.card .card__button');
    // Function to handle the selection of a skin
    function handleSelectSkin(event: any) {
        function _applySkin() {
            (<HTMLImageElement>selectedSVGContainer).src = "../../assets/global-skins/" + name + ".svg";
            localStorage.setItem('playerSkin', name as string)
}
        const div1 = event.currentTarget.parentNode.previousElementSibling.querySelector("div") as HTMLDivElement
        const div = div1.querySelector("div")?.querySelector("div") as HTMLDivElement
        const name = div.getAttribute("id");
        const currencyOfSkin = SkinCurrencies.get(SkinsEncoding.get(name!)!)
        const selectedSVGContainer = document.getElementById('selected-img-container');
        if (!(skinsAvailable as string[]).includes(name as string)) {
            if (currencyA >= Number(currencyOfSkin)) {
                changeCurrency(token as string, name as string, Number(currencyOfSkin));
                alert("Transaction completed! Enjoy your new skin :P")
                _applySkin()
            }
            else { alert("Not enough credits"); return 0; }
        }
        else { _applySkin(); alert("Equipped " + name as string + " skin succesfully! :P") }
    }
    function _selectButtonForEachFunction(button: Element) {
        let skins: string[] = []
        fetch("/api/getSkins", { headers: { "Authorization": "Bearer " + (token as string) } }).then(async res => {
            if (res.ok) {
                _skin = (await res.json()).skinsAvailable;
                skins = _skin.split(";")
            }
        }).then(() => {
            const buttonID = button.getAttribute("id")
        if((skins as string[]).includes(buttonID as string)) { button.textContent = "Equip Skin"; (button as HTMLElement).style.background = "#00ff00" }
        button.addEventListener('click', handleSelectSkin);
    })
        return button
    }
    // Add click event listener to each "Select" button for skins
    selectButtons.forEach(button => { _selectButtonForEachFunction(button)
            
    });
    document.getElementById("close-button")!.addEventListener("click", closeLoadout)
    // Retrieve the last selected skin from localStorage and display it on page load
    const lastSelectedSVG = localStorage.getItem('playerSkin');
    if (lastSelectedSVG) {
        const selectedSVGContainer = document.getElementById('selected-img-container');
        (<HTMLImageElement>selectedSVGContainer).src = `../../assets/global-skins/${lastSelectedSVG}.svg`;
    } else {
        // If no skin has been selected before, automatically select the "Islander-Deafult" skin
        const selectedSVGContainer = document.getElementById('selected-img-container');
        (<HTMLImageElement>selectedSVGContainer).src = "../../assets/global-skins/default.svg";
        localStorage.setItem('playerSkin', "default")
    }
});

// Function to change the cursor
function changeCursor(cursorType: string) {
    document.documentElement.style.cursor = cursorType;
    // Store the chosen cursor in local storage
    localStorage.setItem('chosenCursor', cursorType);
}


// Function to reset the cursor to default
function resetCursor() {
    document.documentElement.style.cursor = 'default';
    // Remove the chosen cursor from local storage
    localStorage.removeItem('chosenCursor');
}


// Check for a stored cursor and apply it on page load
const storedCursor = localStorage.getItem('chosenCursor');
if (storedCursor) {
    changeCursor(storedCursor);
}