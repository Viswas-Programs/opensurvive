"use strict";
// This file records the state of things
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKeyPressed = isKeyPressed;
exports.addKeyPressed = addKeyPressed;
exports.removeKeyPressed = removeKeyPressed;
exports.isMousePressed = isMousePressed;
exports.addMousePressed = addMousePressed;
exports.removeMousePressed = removeMousePressed;
exports.isMenuHidden = isMenuHidden;
exports.toggleMenu = toggleMenu;
exports.isHudHidden = isHudHidden;
exports.toggleHud = toggleHud;
exports.isMapOpened = isMapOpened;
exports.toggleMap = toggleMap;
exports.isMapHidden = isMapHidden;
exports.toggleMinimap = toggleMinimap;
exports.isBigMap = isBigMap;
exports.toggleBigMap = toggleBigMap;
exports.isMouseDisabled = isMouseDisabled;
exports.toggleMouseDisabled = toggleMouseDisabled;
exports.getUsername = getUsername;
exports.setUsername = setUsername;
exports.getToken = getToken;
exports.setToken = setToken;
const keyPressed = new Map();
function isKeyPressed(key) { return !!keyPressed.get(key); }
function addKeyPressed(key) { keyPressed.set(key, true); }
function removeKeyPressed(key) { keyPressed.delete(key); }
const mousePressed = new Map();
function isMousePressed(button) { return !!mousePressed.get(button); }
function addMousePressed(button) { mousePressed.set(button, true); }
function removeMousePressed(button) { mousePressed.delete(button); }
var menuHidden = true;
function isMenuHidden() { return menuHidden; }
function toggleMenu() { menuHidden = !menuHidden; }
var hudHidden = false;
function isHudHidden() { return hudHidden; }
function toggleHud() {
    hudHidden = !hudHidden;
    if (hudHidden)
        document.getElementById("hud").classList.add("hidden");
    else
        document.getElementById("hud").classList.remove("hidden");
}
var mapOpened = false;
function isMapOpened() { return mapOpened; }
function toggleMap() { mapOpened = !mapOpened; }
var mapHidden = false;
function isMapHidden() { return mapHidden; }
function toggleMinimap() { mapHidden = !mapHidden; }
var bigMap = false;
function isBigMap() { return bigMap; }
function toggleBigMap() { bigMap = !bigMap; }
var mouseDisabled = false;
function isMouseDisabled() { return mouseDisabled; }
function toggleMouseDisabled() { mouseDisabled = !mouseDisabled; }
// Used when cookies are not accepted
var username;
function getUsername() { return username; }
function setUsername(u) { return username = u; }
var token;
function getToken() { return token; }
function setToken(t) { return token = t; }
