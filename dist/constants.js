"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunColor = exports.LANG = exports.GLOBAL_UNIT_MULTIPLIER = exports.TIMEOUT = exports.MINIMAP_SIZE = exports.GRID_INTERVAL = exports.movementKeys = exports.KeyBind = void 0;
// More like configuration
var KeyBind;
(function (KeyBind) {
    KeyBind["MENU"] = "Escape";
    KeyBind["HIDE_HUD"] = "F1";
    KeyBind["WORLD_MAP"] = "g";
    KeyBind["HIDE_MAP"] = "z";
    KeyBind["BIG_MAP"] = "v";
    KeyBind["RIGHT"] = "d";
    KeyBind["UP"] = "w";
    KeyBind["LEFT"] = "a";
    KeyBind["DOWN"] = "s";
    KeyBind["INTERACT"] = "f";
    KeyBind["MELEE"] = "e";
    KeyBind["LAST_USED"] = "q";
    KeyBind["RELOAD"] = "r";
    KeyBind["CANCEL"] = "x";
})(KeyBind || (exports.KeyBind = KeyBind = {}));
exports.movementKeys = [KeyBind.RIGHT, KeyBind.UP, KeyBind.LEFT, KeyBind.DOWN].map(k => k);
exports.GRID_INTERVAL = 20;
exports.MINIMAP_SIZE = 100;
exports.TIMEOUT = 10000;
// Translate original surviv.io game units to suit this one
exports.GLOBAL_UNIT_MULTIPLIER = 0.5;
// For now we will assume the user uses English
exports.LANG = "en_us";
var GunColor;
(function (GunColor) {
    GunColor[GunColor["YELLOW"] = 0] = "YELLOW";
    GunColor[GunColor["RED"] = 1] = "RED";
    GunColor[GunColor["BLUE"] = 2] = "BLUE";
    GunColor[GunColor["GREEN"] = 3] = "GREEN";
    GunColor[GunColor["BLACK"] = 4] = "BLACK";
    GunColor[GunColor["OLIVE"] = 5] = "OLIVE";
    GunColor[GunColor["ORANGE"] = 6] = "ORANGE";
    GunColor[GunColor["PURPLE"] = 7] = "PURPLE";
    GunColor[GunColor["TEAL"] = 8] = "TEAL";
    GunColor[GunColor["BROWN"] = 9] = "BROWN";
    GunColor[GunColor["PINK"] = 10] = "PINK";
    GunColor[GunColor["PURE_BLACK"] = 11] = "PURE_BLACK";
    GunColor[GunColor["CURSED"] = 12] = "CURSED";
    GunColor[GunColor["BUGLE"] = 13] = "BUGLE";
})(GunColor || (exports.GunColor = GunColor = {}));
