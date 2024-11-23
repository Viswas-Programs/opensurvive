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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTPS = exports.getPlayer = exports.getId = exports.world = void 0;
const howler_1 = require("howler");
const constants_1 = require("./constants");
const renderer_1 = require("./renderer");
const map_1 = require("./rendering/map");
const states_1 = require("./states");
const entities_1 = require("./store/entities");
const obstacles_1 = require("./store/obstacles");
const terrains_1 = require("./store/terrains");
const math_1 = require("./types/math");
const packet_1 = require("./types/packet");
const world_1 = require("./types/world");
const utils_1 = require("./utils");
const building_1 = __importDefault(require("./types/building"));
const cookies_utils_1 = require("cookies-utils");
const homepage_1 = require("./homepage");
const languages_1 = require("./languages");
//handle users that tried to go to old domain name, or direct ip
var urlargs = new URLSearchParams(window.location.search);
if (urlargs.get("from")) {
    alert("We have moved from " + urlargs.get("from") + " to islandr.io!");
}
var id;
var tps = 1; // Default should be 1, so even if no TPS detail from server, we will not be dividing by 0
var username;
var address;
var skin = localStorage.getItem("playerSkin");
if (!localStorage.getItem("playerDeathImg"))
    localStorage.setItem("playerDeathImg", "default");
var deathImg = localStorage.getItem("playerDeathImg");
console.log(skin);
console.log(deathImg);
const isMobile = /Android/.test(navigator.userAgent) || /iPhone/.test(navigator.userAgent) || /iPad/.test(navigator.userAgent) || /Tablet/.test(navigator.userAgent) || /Macintosh/.test(navigator.userAgent);
console.log(isMobile, navigator.userAgent);
const _ammosToDisplay = ["9mm", "12 gauge", "7.62mm", "5.56mm", "5.7mm", ".308 subsonic"];
var player;
function getId() { return id; }
exports.getId = getId;
function getPlayer() { return player; }
exports.getPlayer = getPlayer;
function getTPS() { return tps; }
exports.getTPS = getTPS;
var ws;
var connected = false;
function getConnected() { return connected; }
function setConnected(v) { connected = v; return connected; }
var modeMapColours;
(function (modeMapColours) {
    modeMapColours[modeMapColours["normal"] = 8434257] = "normal";
    modeMapColours[modeMapColours["suroi_collab"] = 75641688] = "suroi_collab";
})(modeMapColours || (modeMapColours = {}));
const joystick = document.getElementsByClassName('joystick-container')[0];
const handle = document.getElementsByClassName('joystick-handle')[0];
const aimJoystick = document.getElementsByClassName('aimjoystick-container')[0];
const aimHandle = document.getElementsByClassName('aimjoystick-handle')[0];
let _selectedScope = 1;
let scopeChanged = false;
const ammosContainer = document.getElementsByClassName("ammos");
function init(address) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize the websocket
        var protocol = "ws";
        // if ((<HTMLInputElement>document.getElementById("wss")).checked) protocol += "s";
        ws = new WebSocket(`${protocol}://${address}`);
        ws.binaryType = "arraybuffer";
        yield new Promise((res, rej) => {
            const timer = setTimeout(() => {
                rej(new Error("Failed finding game"));
                ws.close();
            }, constants_1.TIMEOUT);
            ws.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
                const data = (0, utils_1.receive)(event.data);
                id = data.id;
                tps = data.tps;
                exports.world = new world_1.World(new math_1.Vec2(data.size[0], data.size[1]), (0, terrains_1.castTerrain)(data.terrain).setColour((modeMapColours[(0, homepage_1.getMode)()])));
                const gameObjects = [obstacles_1.Bush, obstacles_1.Tree, obstacles_1.Barrel, obstacles_1.Crate, obstacles_1.Desk, obstacles_1.Stone, obstacles_1.Toilet, obstacles_1.ToiletMore, obstacles_1.Table];
                gameObjects.forEach(OBJ => { OBJ.updateAssets(); });
                // Call renderer start to setup
                yield (0, renderer_1.start)();
                var currentCursor = localStorage.getItem("selectedCursor");
                if (!currentCursor) {
                    localStorage.setItem("selectedCursor", "default");
                    currentCursor = localStorage.getItem("selectedCursor");
                }
                if (currentCursor) {
                    document.documentElement.style.cursor = currentCursor;
                }
                const responsePacket = new packet_1.ResponsePacket(id, username, skin, deathImg, isMobile, ((0, cookies_utils_1.cookieExists)("gave_me_cookies") ? (0, cookies_utils_1.getCookieValue)("access_token") : (0, states_1.getToken)()));
                (0, utils_1.send)(ws, responsePacket);
                console.log(responsePacket);
                connected = true;
                setConnected(true);
                showMobControls();
                clearTimeout(timer);
                const scopes = document.getElementById(`scopes`);
                const scopeList = [1, 2, 4, 8, 15];
                const x1scope = scopes === null || scopes === void 0 ? void 0 : scopes.children.item(0);
                x1scope.style.background = "rgba(55, 55, 55, 1.5)";
                x1scope.addEventListener("click", () => {
                    if (_selectedScope == 1)
                        return;
                    _selectedScope = 1;
                    (0, utils_1.send)(ws, new packet_1.ServerScopeUpdatePacket(1));
                    for (let ii = 0; ii < scopeList.length; ii++) {
                        console.log(scopeList[ii], ii);
                        if (_selectedScope == scopeList[ii]) {
                            console.log('yuh');
                            (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(55, 55, 55, 1.5)";
                        }
                        else {
                            console.log('nop');
                            (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(51, 51, 51, 0.5)";
                        }
                    }
                });
                // Setup healing items click events
                for (const element of document.getElementsByClassName("healing-panel")) {
                    const el = element;
                    console.log("Adding events for", el.id);
                    const ii = parseInt(el.id.split("-").pop());
                    el.onmouseenter = el.onmouseleave = () => (0, states_1.toggleMouseDisabled)();
                    el.onclick = () => {
                        if (!el.classList.contains("enabled"))
                            return;
                        (0, utils_1.send)(ws, new packet_1.UseHealingPacket(entities_1.Healing.mapping[ii]));
                    };
                }
                showMobileExclusiveBtns();
                const interval = setInterval(() => {
                    if (connected)
                        (0, utils_1.send)(ws, new packet_1.PingPacket());
                    else
                        clearInterval(interval);
                }, 1000);
                ws.onmessage = (event) => {
                    const data = (0, utils_1.receive)(event.data);
                    switch (data.type) {
                        case "game": {
                            const gamePkt = data;
                            exports.world.updateEntities(gamePkt.entities, gamePkt.discardEntities);
                            exports.world.updateObstacles(gamePkt.obstacles, gamePkt.discardObstacles);
                            exports.world.updateLiveCount(gamePkt.alivecount);
                            if (gamePkt.safeZone)
                                exports.world.updateSafeZone(gamePkt.safeZone);
                            if (gamePkt.nextSafeZone)
                                exports.world.updateNextSafeZone(gamePkt.nextSafeZone);
                            if (!player)
                                player = new entities_1.FullPlayer(gamePkt.player);
                            else
                                player.copy(gamePkt.player);
                            // Client side ticking
                            exports.world.clientTick(player);
                            break;
                        }
                        case "map": {
                            // This should happen once only normally
                            const mapPkt = data;
                            console.log("packet terrains:", mapPkt.terrains);
                            exports.world.terrains = mapPkt.terrains.map(ter => (0, terrains_1.castTerrain)(ter));
                            console.log("terrains:", exports.world.terrains);
                            exports.world.obstacles = mapPkt.obstacles.map(obs => (0, obstacles_1.castObstacle)((0, obstacles_1.castMinObstacle)(obs))).filter(obs => !!obs);
                            exports.world.buildings = mapPkt.buildings.map(bui => new building_1.default(bui));
                            (0, map_1.initMap)();
                            //Show player count once game starts
                            document.querySelector("#playercountcontainer").style.display = "block";
                            break;
                        }
                        case "sound": {
                            if (!player)
                                break;
                            const soundPkt = data;
                            const howl = new howler_1.Howl({
                                src: `assets/${(0, homepage_1.getMode)()}/sounds/${soundPkt.path}`
                            });
                            const pos = math_1.Vec2.fromMinVec2(soundPkt.position);
                            const relative = pos.addVec(player.position.inverse()).scaleAll(1 / 60);
                            howl.pos(relative.x, relative.y);
                            const id = howl.play();
                            exports.world.sounds.set(id, { howl, pos });
                            howl.on("end", () => exports.world.sounds.delete(id));
                            break;
                        }
                        case "particles": {
                            const partPkt = data;
                            exports.world.addParticles(partPkt.particles);
                            break;
                        }
                        case "announce": {
                            const announcementPacket = data;
                            const killFeeds = document.getElementById("kill-feeds");
                            const killFeedItem = document.createElement("div");
                            if ((killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.childNodes.length) > 5) {
                                killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.childNodes[killFeeds.childNodes.length - 1].remove();
                            }
                            if (announcementPacket.killer == getPlayer().id) {
                                killFeedItem.style.background = "rgba(0, 0, 139, 0.5)";
                            }
                            else {
                                killFeedItem.style.background = "rgba(139, 0, 0, 0.5)";
                            }
                            killFeedItem.prepend(`${announcementPacket.announcement}\n`);
                            killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.prepend(killFeedItem);
                            setTimeout(() => {
                                console.log(killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.childNodes, killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.children);
                                killFeeds === null || killFeeds === void 0 ? void 0 : killFeeds.childNodes[killFeeds.childNodes.length - 1].remove();
                            }, 5000);
                            break;
                        }
                        case "scopeUpdate": {
                            const scopeChangePkt = data;
                            const scopeElement = scopes === null || scopes === void 0 ? void 0 : scopes.children.item(scopeList.indexOf(scopeChangePkt.scope));
                            _selectedScope = Number(scopeChangePkt.scope);
                            scopeElement.style.display = "block";
                            if (Number(scopeChangePkt.scope) > _selectedScope) {
                                for (let ii = 0; ii < scopeList.length; ii++) {
                                    if (_selectedScope == scopeList[ii]) {
                                        (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(55, 55, 55, 1.5)";
                                    }
                                    else {
                                        (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(51, 51, 51, 0.5)";
                                    }
                                }
                            }
                            scopeElement.addEventListener("click", () => {
                                var _a;
                                if (scopeElement.textContent.includes(String(_selectedScope)))
                                    return;
                                _selectedScope = scopeChangePkt.scope;
                                (0, utils_1.send)(ws, new packet_1.ServerScopeUpdatePacket((_a = scopeElement.textContent) === null || _a === void 0 ? void 0 : _a.replace("x", "")));
                                for (let ii = 0; ii < scopeList.length; ii++) {
                                    if (_selectedScope == scopeList[ii]) {
                                        (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(55, 55, 55, 1.5)";
                                    }
                                    else {
                                        (scopes === null || scopes === void 0 ? void 0 : scopes.children.item(ii)).style.background = "rgba(51, 51, 51, 0.5)";
                                    }
                                }
                            });
                            break;
                        }
                        case "ammoUpdatePacket": {
                            const ammoUpdatePkt = data;
                            const ammoChange = (0, languages_1.translate)(constants_1.LANG, "_ammosDisplay." + ammoUpdatePkt.ammoToChange);
                            const ammoElement = ammosContainer.item(_ammosToDisplay.indexOf(ammoChange));
                            ammoElement.textContent = `${ammoChange}: ${ammoUpdatePkt.numberOfAmmo}`;
                        }
                    }
                };
            });
            // Reset everything when connection closes
            ws.onclose = () => {
                connected = false;
                setConnected(false);
                (0, renderer_1.stop)();
                howler_1.Howler.stop();
                id = null;
                tps = 1;
                username = null;
                player = null;
                res(undefined);
                //remove playercount
            };
            ws.onerror = (err) => {
                console.error(err);
                rej(new Error("Failed joining game"));
            };
        });
    });
}
(_a = document.getElementById("connect")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const errorText = document.getElementById("error-div");
    username = document.getElementById("username").value;
    address = document.getElementById("address").value;
    try {
        check(username, address);
        yield init(address);
        errorText.style.display = "none";
    }
    catch (error) {
        errorText.innerHTML = error.message;
        errorText.style.display = "block";
        return;
    }
}));
function showMobileExclusiveBtns() {
    if (getConnected() && isMobile) {
        function __sendPkt() { const rlpk = new packet_1.ReloadWeaponPacket(); (0, utils_1.send)(ws, rlpk); }
        const ReloadButtonElement = document.getElementById("reload-btn");
        ReloadButtonElement.style.display = 'block';
        ReloadButtonElement.addEventListener('click', (event) => { event.stopPropagation(); __sendPkt(); });
        const MenuBtnElement = document.getElementById("menu-btn");
        MenuBtnElement.style.display = 'block';
        MenuBtnElement.addEventListener('click', (event) => {
            var _a, _b;
            event.stopPropagation();
            if ((0, states_1.isMenuHidden)()) {
                (_a = document.getElementById("settings")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
                (0, states_1.toggleMenu)();
            }
            else {
                (_b = document.getElementById("settings")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
                (0, states_1.toggleMenu)();
            }
        });
        for (let ii = 0; ii < 4; ii++) {
            document.getElementsByClassName("weapon-panel")[ii].style.height = "8.5vh";
            document.getElementsByClassName("weapon-index")[ii].style.height = "4vh";
        }
        document.getElementById("weapon-container").style.top = "-4%";
    }
}
function showMobControls() {
    if (isMobile && getConnected()) {
        joystick.classList.remove("hidden");
        handle.classList.remove("hidden");
        aimJoystick.classList.remove("hidden");
        aimHandle.classList.remove("hidden");
        var joystickActive = false;
        var joystickDirection = '';
        var aimJoystickActive = false;
        let resettedMovement = false;
        // Get the joystick and handle elements
        const HandlerObjects = [joystick, handle, aimJoystick, aimHandle];
        HandlerObjects.forEach(handler => {
            handler.style.display = 'block';
        });
        // Add event listeners for touch events
        handle.addEventListener('touchstart', handleTouchStart);
        handle.addEventListener('touchmove', handleTouchMove);
        handle.addEventListener('touchcancel', handleTouchEnd);
        handle.addEventListener('touchend', handleTouchEnd);
        joystick.addEventListener('touchcancel', handleTouchEnd);
        joystick.addEventListener('touchend', handleTouchEnd);
        //Add event listeners for the aim joystick
        aimJoystick.addEventListener('touchcancel', handleAimJoystickTouchEnd);
        aimJoystick.addEventListener('touchend', handleAimJoystickTouchEnd);
        aimHandle.addEventListener('touchstart', handleAimJoystickTouchStart);
        aimHandle.addEventListener('touchmove', handleTouchMoveAimJoystick);
        aimHandle.addEventListener('touchcancel', handleAimJoystickTouchEnd);
        aimHandle.addEventListener('touchend', handleAimJoystickTouchEnd);
        var centerX = aimJoystick.offsetWidth / 2;
        var centerY = aimJoystick.offsetHeight / 2;
        // Function to handle touchstart event
        function handleTouchStart(event) {
            event.preventDefault();
            joystickActive = true;
            resettedMovement = false;
            return 0;
        }
        function handleAimJoystickTouchStart(event) { event.preventDefault(); aimJoystickActive = true; return 0; }
        // Function to handle touchmove event
        function handleTouchMove(event) {
            event.preventDefault();
            resettedMovement = false;
            if (joystickActive) {
                var touch = event.targetTouches[0];
                var posX = touch.pageX - joystick.offsetLeft;
                var posY = touch.pageY - joystick.offsetTop;
                var touchX = event.touches[0].clientX - joystick.offsetLeft - joystick.offsetWidth / 2;
                var touchY = event.touches[0].clientY - joystick.offsetTop - joystick.offsetWidth / 2;
                // Calculate the distance from the center of the joystick
                var distance = Math.sqrt(Math.pow(posX - joystick.offsetWidth / 2, 2) + Math.pow(posY - joystick.offsetHeight / 2, 2));
                var maxDistance = 100;
                var angle;
                // If the distance exceeds the maximum, limit it
                angle = Math.atan2(posY - joystick.offsetHeight / 2, posX - joystick.offsetWidth / 2);
                if (distance > maxDistance) {
                    var deltaX = Math.cos(angle) * maxDistance;
                    var deltaY = Math.sin(angle) * maxDistance;
                    posX = joystick.offsetWidth / 2 + deltaX;
                    posY = joystick.offsetHeight / 2 + deltaY;
                }
                var joystickAngle = Math.atan2(touchY, touchX);
                const joystickX = (joystick.offsetWidth / 2 - handle.offsetWidth / 2) * Math.cos(joystickAngle);
                const joystickY = (joystick.offsetWidth / 2 - handle.offsetWidth / 2) * Math.sin(joystickAngle);
                handle.style.transform = 'translate(' + joystickX + 'px, ' + joystickY + 'px)';
                // Calculate the joystick direction based on the handle position
                joystickDirection = '';
                (0, utils_1.send)(ws, new packet_1.MovementPacket(angle));
            }
        }
        //function for joystick aim part
        function handleTouchMoveAimJoystick(event) {
            event.preventDefault();
            if (!aimJoystickActive)
                return;
            var touch = event.targetTouches[0];
            var posX = touch.pageX - aimJoystick.offsetLeft;
            var posY = touch.pageY - aimJoystick.offsetTop;
            var touchX = event.touches[0].clientX - aimJoystick.offsetLeft - aimJoystick.offsetWidth / 2;
            var touchY = event.touches[0].clientY - aimJoystick.offsetTop - aimJoystick.offsetWidth / 2;
            // Calculate the distance from the center of the joystick
            var distance = Math.sqrt(Math.pow(posX - aimJoystick.offsetWidth / 2, 2) + Math.pow(posY - aimJoystick.offsetHeight / 2, 2));
            var maxDistance = 100;
            var angle;
            // If the distance exceeds the maximum, limit it
            angle = Math.atan2(posY - aimJoystick.offsetHeight / 2, posX - aimJoystick.offsetWidth / 2);
            if (distance > maxDistance) {
                var deltaX = Math.cos(angle) * maxDistance;
                var deltaY = Math.sin(angle) * maxDistance;
                posX = aimJoystick.offsetWidth / 2 + deltaX;
                posY = aimJoystick.offsetHeight / 2 + deltaY;
            }
            var joystickAngle = Math.atan2(touchY, touchX);
            const joystickX = (aimJoystick.offsetWidth / 2 - aimHandle.offsetWidth / 2) * Math.cos(joystickAngle);
            const joystickY = (aimJoystick.offsetWidth / 2 - aimHandle.offsetWidth / 2) * Math.sin(joystickAngle);
            aimHandle.style.transform = 'translate(' + joystickX + 'px, ' + joystickY + 'px)';
            (0, utils_1.send)(ws, new packet_1.PlayerRotationDelta(angle));
            if (distance > maxDistance) {
                (0, states_1.addMousePressed)(0);
                (0, utils_1.send)(ws, new packet_1.MousePressPacket(0));
            }
        }
        // Function to handle touchend event
        function handleAimJoystickTouchEnd(event) {
            event.preventDefault();
            aimJoystickActive = false;
            aimHandle.style.transform = "translate(0px, 0px)";
            (0, states_1.removeMousePressed)(1);
            (0, utils_1.send)(ws, new packet_1.MouseReleasePacket(0));
        }
        function handleTouchEnd(event) {
            event.preventDefault();
            joystickActive = false;
            handle.style.transform = "translate(0px, 0px)";
            joystickDirection = '';
            if (resettedMovement == false)
                (0, utils_1.send)(ws, new packet_1.MovementResetPacket());
            console.log(resettedMovement);
            resettedMovement = true;
        }
        setInterval(function () {
            if ((joystickDirection == '' || !joystickActive) && getConnected() && resettedMovement == false) {
                (0, utils_1.send)(ws, new packet_1.MovementResetPacket());
                resettedMovement = true;
            }
        }, 100);
    }
}
function check(username, address) {
    if (!username)
        throw new Error("Please provide a username.");
    else if (username.length > 50)
        throw new Error("Username too long! Try another username.");
    if (!address)
        throw new Error("Please provide an address.");
}
(_b = document.getElementById("disconnect")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    var _a;
    ws.close();
    (_a = document.getElementById("settings")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    joystick.style.display = 'none';
    handle.style.display = 'none';
    aimJoystick.style.display = 'none';
    aimHandle.style.display = 'none';
    (0, states_1.toggleMenu)();
});
(_c = document.getElementById("resume")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    var _a;
    (_a = document.getElementById("settings")) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (0, states_1.toggleMenu)();
});
window.onkeydown = (event) => {
    if (!connected || (0, states_1.isKeyPressed)(event.key))
        return;
    event.stopPropagation();
    (0, states_1.addKeyPressed)(event.key);
    const settingsElem = document.getElementById("settings");
    if (event.key == constants_1.KeyBind.MENU) {
        if ((0, states_1.isMenuHidden)())
            settingsElem === null || settingsElem === void 0 ? void 0 : settingsElem.classList.remove("hidden");
        else
            settingsElem === null || settingsElem === void 0 ? void 0 : settingsElem.classList.add("hidden");
        (0, states_1.toggleMenu)();
    }
    else if (event.key == constants_1.KeyBind.HIDE_HUD)
        (0, states_1.toggleHud)();
    else if (event.key == constants_1.KeyBind.WORLD_MAP)
        (0, states_1.toggleMap)();
    else if (event.key == constants_1.KeyBind.HIDE_MAP)
        (0, states_1.toggleMinimap)();
    else if (event.key == constants_1.KeyBind.BIG_MAP)
        (0, states_1.toggleBigMap)();
    if ((0, states_1.isMenuHidden)()) {
        const index = constants_1.movementKeys.indexOf(event.key);
        if (index >= 0)
            (0, utils_1.send)(ws, new packet_1.MovementPressPacket(index));
        else if (event.key == constants_1.KeyBind.INTERACT)
            (0, utils_1.send)(ws, new packet_1.InteractPacket());
        else if (event.key == constants_1.KeyBind.RELOAD)
            (0, utils_1.send)(ws, new packet_1.ReloadWeaponPacket());
        else if (event.key == constants_1.KeyBind.CANCEL)
            (0, utils_1.send)(ws, new packet_1.CancelActionsPacket());
        else if (!isNaN(parseInt(event.key)))
            (0, utils_1.send)(ws, new packet_1.SwitchWeaponPacket(parseInt(event.key) - 1, true));
    }
};
window.onkeyup = (event) => {
    if (!connected)
        return;
    event.stopPropagation();
    (0, states_1.removeKeyPressed)(event.key);
    const index = constants_1.movementKeys.indexOf(event.key);
    if (index >= 0)
        (0, utils_1.send)(ws, new packet_1.MovementReleasePacket(index));
};
window.onmousemove = (event) => {
    if (!connected || isMobile)
        return;
    event.stopPropagation();
    (0, utils_1.send)(ws, new packet_1.MouseMovePacket(event.x - window.innerWidth / 2, event.y - window.innerHeight / 2));
};
window.onmousedown = (event) => {
    if (!connected || (0, states_1.isMouseDisabled)() || isMobile)
        return;
    event.stopPropagation();
    (0, states_1.addMousePressed)(event.button);
    (0, utils_1.send)(ws, new packet_1.MousePressPacket(event.button));
};
window.onmouseup = (event) => {
    if (!connected || isMobile)
        return;
    event.stopPropagation();
    (0, states_1.removeMousePressed)(event.button);
    (0, utils_1.send)(ws, new packet_1.MouseReleasePacket(event.button));
};
window.onwheel = (event) => {
    if (!connected || !player)
        return;
    event.stopPropagation();
    const delta = event.deltaY < 0 ? -1 : 1;
    (0, utils_1.send)(ws, new packet_1.SwitchWeaponPacket(delta));
};
window.oncontextmenu = (event) => {
    if (connected)
        event.preventDefault();
};
window.ondblclick = (event) => {
    if (connected)
        event.preventDefault();
};
// Because 4 is grenade and it's not done yet
for (let ii = 0; ii < 3; ii++) {
    const panel = document.getElementById("weapon-panel-" + ii);
    panel.onmouseenter = panel.onmouseleave = () => (0, states_1.toggleMouseDisabled)();
    panel.onclick = () => {
        if (!connected || !player)
            return;
        (0, utils_1.send)(ws, new packet_1.SwitchWeaponPacket(ii, true));
    };
}
