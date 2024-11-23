"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.castParticle = exports.Ripple = exports.Wood = exports.PARTICLE_SUPPLIERS = void 0;
const particle_1 = require("../../types/particle");
exports.PARTICLE_SUPPLIERS = new Map();
var wood_1 = require("./wood");
Object.defineProperty(exports, "Wood", { enumerable: true, get: function () { return __importDefault(wood_1).default; } });
var ripple_1 = require("./ripple");
Object.defineProperty(exports, "Ripple", { enumerable: true, get: function () { return __importDefault(ripple_1).default; } });
function castParticle(minParticle) {
    var _a;
    return ((_a = exports.PARTICLE_SUPPLIERS.get(minParticle.id)) === null || _a === void 0 ? void 0 : _a.create(minParticle)) || new particle_1.DummyParticle(minParticle);
}
exports.castParticle = castParticle;
