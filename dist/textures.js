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
exports.getTexture = exports.getTracerColor = exports.getParticleImagePath = exports.getHealingImagePath = exports.getVestImagePath = exports.getHelmetImagePath = exports.getBackpackImagePath = exports.getBarrelImagePath = exports.getWeaponImagePath = void 0;
const homepage_1 = require("./homepage");
function getWeaponImagePath(id) {
    return id ? `assets/${(0, homepage_1.getMode)()}/images/game/loots/weapons/${id}.svg` : "";
}
exports.getWeaponImagePath = getWeaponImagePath;
function getBarrelImagePath(id) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/guns/${id}.svg`;
}
exports.getBarrelImagePath = getBarrelImagePath;
function getBackpackImagePath(level) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/loots/backpacks/${level}.svg`;
}
exports.getBackpackImagePath = getBackpackImagePath;
function getHelmetImagePath(level) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/loots/proc-items/helmet-level-${level}.svg`;
}
exports.getHelmetImagePath = getHelmetImagePath;
function getVestImagePath(level) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/loots/proc-items/vest-level-${level}.svg`;
}
exports.getVestImagePath = getVestImagePath;
function getHealingImagePath(id) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/loots/healings/${id}.svg`;
}
exports.getHealingImagePath = getHealingImagePath;
function getParticleImagePath(id) {
    return `assets/${(0, homepage_1.getMode)()}/images/game/particles/${id}.svg`;
}
exports.getParticleImagePath = getParticleImagePath;
const tracerColors = new Map();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(`data/colors/tracers.json`).then(res => res.json());
    for (const id of Object.keys(data)) {
        tracerColors.set(id, data[id]);
    }
}))();
function getTracerColor(id) {
    return tracerColors.get(id);
}
exports.getTracerColor = getTracerColor;
const textureStore = new Map();
function getTexture(path) {
    if (!textureStore.has(path)) {
        const img = new Image();
        img.src = path;
        textureStore.set(path, img);
        return img;
    }
    else
        return textureStore.get(path);
}
exports.getTexture = getTexture;
