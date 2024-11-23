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
exports.translate = translate;
const LANGUAGE_MAP = new Map();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("data/languages/.list.json");
    if (!res.ok)
        return;
    const list = yield res.json();
    for (const lang of list) {
        const res = yield fetch(`data/languages/${lang}.json`);
        if (!res.ok)
            continue;
        LANGUAGE_MAP.set(lang, yield res.json());
    }
}))();
function translate(lang, key, ...args) {
    if (!key)
        return "";
    const mapping = LANGUAGE_MAP.get(lang);
    if (!mapping)
        return key;
    if (mapping[key]) {
        let translated = mapping[key];
        for (const arg of args)
            translated = translated.replace("%?", arg);
        return translated.replace(/%\?/g, "");
    }
    return key;
}
