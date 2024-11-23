"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const states_1 = require("./states");
const utils_1 = require("./utils");
const cookies_utils_1 = require("cookies-utils");
let currencyA = 0;
const token = (0, cookies_utils_1.cookieExists)("gave_me_cookies") ? (0, cookies_utils_1.getCookieValue)("access_token") : (0, states_1.getToken)();
let skinsAvailable = [];
let _skin = "";
if (token != undefined) {
    if ((0, cookies_utils_1.cookieExists)("username")) {
        const username = (0, cookies_utils_1.getCookieValue)("username");
        if ((0, cookies_utils_1.cookieExists)("access_token")) {
            const accessToken = (0, cookies_utils_1.getCookieValue)("access_token");
            fetch("/api/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, accessToken }) })
                .then(res => {
                if (res.ok) {
                    fetch("/api/currency", { headers: { "Authorization": "Bearer " + token } }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res.ok)
                            currencyA = (yield res.json()).currency;
                    }));
                    fetch("/api/getSkins", { headers: { "Authorization": "Bearer " + token } }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res.ok) {
                            _skin = (yield res.json()).skinsAvailable;
                            skinsAvailable = _skin.split(";");
                            console.log(skinsAvailable);
                        }
                    }));
                }
            });
        }
    }
}
if (window.location.href.includes("/loadout")) {
    let container2Visible = false;
    // Function to show the selected tab content
    function showTab(tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (const content of tabContents) {
            content.style.display = 'none';
        }
        document.getElementById(tabName).style.display = 'block';
        if (tabName === 'skins') {
            showContainer2();
        }
        else {
            hideContainer2();
        }
    }
    // Show loadout container when the loadout button is clicked
    document.getElementById('loadout-button').addEventListener('click', function () {
        const container = document.getElementById('loadout-container');
        const overlay = document.getElementById('overlay');
        container.style.display = 'block';
        overlay.style.display = 'block';
        showTab('skins'); // Show the 'Skins' tab by default
    });
    document.getElementById('loadout-button').click();
    // Function to close the loadout container
    function closeLoadout() {
        hideContainer2();
        const container = document.getElementById('loadout-container');
        const overlay = document.getElementById('overlay');
        if (container && overlay) {
            container.style.display = 'none';
            overlay.style.display = 'none';
        }
        window.location.href = '/';
    }
    window.closeLoadout = closeLoadout;
    // Function to show container2
    function showContainer2() {
        const container2 = document.getElementById('container2');
        container2.style.display = 'block';
        container2Visible = true;
    }
    // Function to hide container2
    function hideContainer2() {
        const container2 = document.getElementById('container2');
        container2.style.display = 'none';
        container2Visible = false;
    }
    //javascript for skins
    document.addEventListener('DOMContentLoaded', () => {
        // Get all the "Select" buttons for skins
        const selectButtons = document.querySelectorAll('.card-list__item.card .card__button');
        // Function to handle the selection of a skin
        function handleSelectSkin(event) {
            var _a;
            function _applySkin() {
                selectedSVGContainer.innerHTML = selectedSVG;
                localStorage.setItem('loadoutSkinTexture', selectedSVG);
                localStorage.setItem('playerSkin', name);
            }
            const selectedSVG = event.currentTarget.parentNode.previousElementSibling.querySelector('svg').outerHTML;
            const div1 = event.currentTarget.parentNode.previousElementSibling.querySelector("div");
            const div = (_a = div1.querySelector("div")) === null || _a === void 0 ? void 0 : _a.querySelector("div");
            const currencyOfSkin = div.getAttribute("currency");
            const name = div.getAttribute("id");
            const selectedSVGContainer = document.getElementById('selected-svg-container');
            if (!skinsAvailable.includes(name)) {
                if (currencyA >= Number(currencyOfSkin)) {
                    (0, utils_1.loadoutChange)(token, name, Number(currencyOfSkin));
                    alert("Transaction completed! Enjoy your new skin :P");
                    _applySkin();
                }
                else {
                    alert("Not enough credits");
                    return 0;
                }
            }
            else {
                _applySkin();
                alert("Equipped " + name + " skin succesfully! :P");
            }
        }
        function _selectButtonForEachFunction(button) {
            let skins = [];
            fetch("/api/getSkins", { headers: { "Authorization": "Bearer " + token } }).then((res) => __awaiter(this, void 0, void 0, function* () {
                if (res.ok) {
                    _skin = (yield res.json()).skinsAvailable;
                    skins = _skin.split(";");
                }
            })).then(() => {
                const buttonID = button.getAttribute("id");
                if (skins.includes(buttonID)) {
                    button.textContent = "Equip Skin";
                    button.style.background = "#00ff00";
                }
                button.addEventListener('click', handleSelectSkin);
            });
            return button;
        }
        // Add click event listener to each "Select" button for skins
        selectButtons.forEach(button => {
            _selectButtonForEachFunction(button);
        });
        // Retrieve the last selected skin from localStorage and display it on page load
        const lastSelectedSVG = localStorage.getItem('loadoutSkinTexture');
        if (lastSelectedSVG) {
            const selectedSVGContainer = document.getElementById('selected-svg-container');
            selectedSVGContainer.innerHTML = lastSelectedSVG;
        }
        else {
            // If no skin has been selected before, automatically select the "Islander-Deafult" skin
            const defaultSVG = document.querySelector('.card-list__item.card:nth-child(1) svg').outerHTML;
            const selectedSVGContainer = document.getElementById('selected-svg-container');
            selectedSVGContainer.innerHTML = defaultSVG;
            localStorage.setItem('loadoutSkinTexture', defaultSVG);
            localStorage.setItem('playerSkin', "default");
        }
    });
    // Function to change the cursor
    function changeCursor(cursorType) {
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
}
else {
    console.log("FALSE");
}
