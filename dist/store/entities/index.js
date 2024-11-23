"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helmet = exports.Vest = exports.Scope = exports.Backpack = exports.FullPlayer = exports.PartialPlayer = exports.Player = exports.Healing = exports.Gun = exports.Grenade = exports.Explosion = exports.Bullet = exports.Ammo = exports.ENTITY_SUPPLIERS = void 0;
exports.castEntity = castEntity;
const entity_1 = require("../../types/entity");
exports.ENTITY_SUPPLIERS = new Map();
var ammo_1 = require("./ammo");
Object.defineProperty(exports, "Ammo", { enumerable: true, get: function () { return __importDefault(ammo_1).default; } });
var bullet_1 = require("./bullet");
Object.defineProperty(exports, "Bullet", { enumerable: true, get: function () { return __importDefault(bullet_1).default; } });
var explosion_1 = require("./explosion");
Object.defineProperty(exports, "Explosion", { enumerable: true, get: function () { return __importDefault(explosion_1).default; } });
var grenade_1 = require("./grenade");
Object.defineProperty(exports, "Grenade", { enumerable: true, get: function () { return __importDefault(grenade_1).default; } });
var gun_1 = require("./gun");
Object.defineProperty(exports, "Gun", { enumerable: true, get: function () { return __importDefault(gun_1).default; } });
var healing_1 = require("./healing");
Object.defineProperty(exports, "Healing", { enumerable: true, get: function () { return __importDefault(healing_1).default; } });
var player_1 = require("./player");
Object.defineProperty(exports, "Player", { enumerable: true, get: function () { return __importDefault(player_1).default; } });
Object.defineProperty(exports, "PartialPlayer", { enumerable: true, get: function () { return player_1.PartialPlayer; } });
Object.defineProperty(exports, "FullPlayer", { enumerable: true, get: function () { return player_1.FullPlayer; } });
var backpack_1 = require("./backpack");
Object.defineProperty(exports, "Backpack", { enumerable: true, get: function () { return __importDefault(backpack_1).default; } });
var scope_1 = require("./scope");
Object.defineProperty(exports, "Scope", { enumerable: true, get: function () { return __importDefault(scope_1).default; } });
var vest_1 = require("./vest");
Object.defineProperty(exports, "Vest", { enumerable: true, get: function () { return __importDefault(vest_1).default; } });
var helmet_1 = require("./helmet");
Object.defineProperty(exports, "Helmet", { enumerable: true, get: function () { return __importDefault(helmet_1).default; } });
// This still need hard-coding unfortunately
function castEntity(minEntity) {
    var _a;
    return ((_a = exports.ENTITY_SUPPLIERS.get(minEntity.type)) === null || _a === void 0 ? void 0 : _a.create(minEntity)) || new entity_1.DummyEntity(minEntity);
}
