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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLoggedIn = exports.getMode = exports.setMode = void 0;
const jquery_1 = __importDefault(require("jquery"));
const cookies_utils_1 = require("cookies-utils");
const markdown_it_1 = __importDefault(require("markdown-it"));
const crypto_1 = require("crypto");
require("./loadout");
const states_1 = require("./states");
let mode = "normal";
console.log("homepage ts called");
function setMode(md) {
    mode = md;
}
exports.setMode = setMode;
function getMode() {
    return mode;
}
exports.getMode = getMode;
(0, jquery_1.default)(document).ready(function () {
    (0, jquery_1.default)('.arrow').click(function () {
        (0, jquery_1.default)('.box-selectable').toggle();
        (0, jquery_1.default)(this).toggleClass('arrow-down');
    });
    (0, jquery_1.default)('.discord').click(function () {
        window.open('http://opensurviv.run.place/discord');
    });
    (0, jquery_1.default)('.info').click(function () {
        (0, jquery_1.default)('.info-box').toggle();
    });
    (0, jquery_1.default)('.close').click(function () {
        (0, jquery_1.default)('.info-box').hide();
        (0, jquery_1.default)('.partner-box').hide();
    });
    (0, jquery_1.default)('.partner').click(function () {
        (0, jquery_1.default)('.partner-box').toggle();
    });
    (0, jquery_1.default)('.loadout').click(function () { window.location.replace(window.location.href += "loadout"); });
});
jquery_1.default.get("assets/" + getMode() + "/CREDITS.md", function (data) {
    document.getElementById("contents").innerHTML = new markdown_it_1.default().render(data);
}, "text");
if (!window.location.href.includes("/loadout")) {
    window.onload = function () {
        document.getElementById('loading').classList.add('zoom-out');
        setTimeout(function () {
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    };
    document.addEventListener('DOMContentLoaded', function () {
        var audio = document.getElementById('menu-audio');
        var volumeIcon = document.getElementById('volume-icon');
        var volumeSlider = document.getElementById('volume-slider');
        var volumeRange = document.getElementById('volume-range');
        var started = false;
        if (!started) {
            audio.play();
            started = true;
        }
        volumeIcon.addEventListener('click', function () {
            if (volumeSlider.style.display === 'none') {
                volumeSlider.style.display = 'block';
            }
            else {
                volumeSlider.style.display = 'none';
            }
        });
        volumeRange.addEventListener('input', function () {
            var volume = Number(volumeRange.value) / 100;
            audio.volume = volume;
        });
    });
    var accepted = -1;
    document.getElementById("button-accept").onclick = () => {
        showAds();
        accepted = 1;
        closeBox();
    };
    document.getElementById("button-decline").onclick = () => {
        hideAds();
        accepted = 0;
        closeBox();
    };
    document.getElementById("button-close").onclick = closeBox;
}
const modes = ["normal", "suroi_collab"];
modes.forEach(md => {
    var _a;
    console.log(document.getElementsByClassName("box-selectable")[0].children[modes.indexOf(md)].querySelector("div"));
    (_a = document.getElementsByClassName("box-selectable")[0].children[modes.indexOf(md)].querySelector("div")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { setMode(md); console.log("DONE:)"); });
});
console.log(getMode());
function showAds() {
    document.querySelectorAll('.ads').forEach(ad => { ad.style.visibility = "visible"; });
}
function hideAds() {
    const allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].tagName === "DIV" && allElements[i].hasAttribute("class") && allElements[i].getAttribute("class").includes("ads")) {
            allElements[i].style.display = "none";
        }
    }
}
function closeBox() {
    //document.getElementById("privacyBox").style.display = "none";
    document.querySelectorAll('.overlays').forEach(overlay => { overlay.style.display = "none"; });
    //document.querySelectorAll('.boxers').forEach(boxer => { (<HTMLElement>boxer).style.display = "none"; });
    if ((0, cookies_utils_1.cookieExists)("gave_me_cookies") && !(0, cookies_utils_1.cookieExists)("ads"))
        (0, cookies_utils_1.setCookie)({ name: "ads", value: accepted.toString() });
}
function setLoggedIn(username) {
    document.getElementById("account").innerHTML = `<h1>${username}</h1><h2 id="currency">Currency: 0</h2><div class="flex"><div class="button" id="button-logout">Log out</div></div>`;
    document.getElementById("button-logout").onclick = () => setLoggedOut(username);
    const input = document.getElementById("username");
    input.value = username;
    input.disabled = true;
    const token = (0, cookies_utils_1.cookieExists)("gave_me_cookies") ? (0, cookies_utils_1.getCookieValue)("access_token") : (0, states_1.getToken)();
    fetch("/api/currency", { headers: { "Authorization": "Bearer " + token } }).then((res) => __awaiter(this, void 0, void 0, function* () {
        if (res.ok)
            document.getElementById("currency").innerHTML = `Currency: ${(yield res.json()).currency}`;
    }));
}
function setLoggedOut(username) {
    document.getElementById("account").innerHTML = `
	<h1>Login / Sign up</h1>
	<input type="text" id="login_username" placeholder="Username..." ${username ? `value="${username}"` : ""} /><br>
	<input type="password" id="password" placeholder="Password..." /><br>
	<div class="flex">
		<div class="button" id="button-login">Login</div>
		<div class="button" id="button-signup">Sign up</div>
	</div>
	`;
    // Login and sign up buttons
    let loginWorking = false, signupWorking = false;
    document.getElementById("button-login").onclick = () => {
        if (loginWorking)
            return;
        loginWorking = true;
        const username = document.getElementById("login_username").value;
        const password = document.getElementById("password").value;
        if (!username || !password)
            return loginWorking = false;
        const hashed = (0, crypto_1.createHash)("sha1").update(password).digest("hex");
        fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: hashed.slice(0, 16) }) })
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res.ok) {
                if ((0, cookies_utils_1.cookieExists)("gave_me_cookies")) {
                    (0, cookies_utils_1.setCookie)({ name: "username", value: username });
                    (0, cookies_utils_1.setCookie)({ name: "access_token", value: (yield res.json()).accessToken });
                }
                else {
                    (0, states_1.setUsername)(username);
                    (0, states_1.setToken)((yield res.json()).accessToken);
                }
                setLoggedIn(username);
            }
        }))
            .finally(() => loginWorking = false);
    };
    document.getElementById("button-signup").onclick = () => {
        if (signupWorking)
            return;
        console.log("signing up");
        signupWorking = true;
        const username = document.getElementById("login_username").value;
        const password = document.getElementById("password").value;
        console.log(username, password);
        if (!username || !password)
            return signupWorking = false;
        const hashed = (0, crypto_1.createHash)("sha1").update(password).digest("hex");
        fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: hashed.slice(0, 16) }) })
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res.ok) {
                if ((0, cookies_utils_1.cookieExists)("gave_me_cookies")) {
                    (0, cookies_utils_1.setCookie)({ name: "username", value: username });
                    (0, cookies_utils_1.setCookie)({ name: "access_token", value: (yield res.json()).accessToken });
                }
                else {
                    (0, states_1.setUsername)(username);
                    (0, states_1.setToken)((yield res.json()).accessToken);
                }
                setLoggedIn(username);
            }
        }))
            .finally(() => signupWorking = false);
    };
    (0, cookies_utils_1.deleteCookie)("access_token");
    (0, states_1.setToken)(undefined);
    const input = document.getElementById("username");
    input.value = "";
    input.disabled = false;
}
if (!(0, cookies_utils_1.cookieExists)("gave_me_cookies")) {
    const button = document.getElementById("cookies-button");
    button.scrollIntoView();
    button.onclick = () => {
        (0, cookies_utils_1.setCookie)({ name: "gave_me_cookies", value: "1" });
        button.classList.add("disabled");
        document.getElementById("cookies-span").innerHTML = "You gave me cookies :D";
        if (accepted >= 0)
            (0, cookies_utils_1.setCookie)({ name: "ads", value: accepted.toString() });
    };
    setLoggedOut();
}
else {
    document.getElementById("cookies-button").classList.add("disabled");
    document.getElementById("cookies-span").innerHTML = "You gave me cookies :D";
    if ((0, cookies_utils_1.cookieExists)("ads")) {
        const ads = (0, cookies_utils_1.getCookieValue)("ads");
        if (ads == "1")
            showAds();
        else
            hideAds();
        closeBox();
    }
    checkLoggedIn();
}
function checkLoggedIn() {
    if ((0, cookies_utils_1.cookieExists)("username")) {
        const username = (0, cookies_utils_1.getCookieValue)("username");
        if ((0, cookies_utils_1.cookieExists)("access_token")) {
            const accessToken = (0, cookies_utils_1.getCookieValue)("access_token");
            fetch("/api/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, accessToken }) })
                .then(res => {
                if (res.ok)
                    setLoggedIn(username);
                else
                    setLoggedOut(username);
            });
        }
        else
            setLoggedOut(username);
    }
    else
        setLoggedOut();
}
exports.checkLoggedIn = checkLoggedIn;
