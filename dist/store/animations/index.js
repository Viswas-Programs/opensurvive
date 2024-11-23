"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFINED_ANIMATIONS = void 0;
const fists_1 = __importDefault(require("./fists"));
const guns_1 = __importDefault(require("./guns"));
exports.DEFINED_ANIMATIONS = new Map();
(0, fists_1.default)();
(0, guns_1.default)();
