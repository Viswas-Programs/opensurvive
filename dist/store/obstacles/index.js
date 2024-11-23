"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.castMinObstacle = exports.castObstacle = exports.Desk = exports.Table = exports.ToiletMore = exports.Door = exports.Toilet = exports.Roof = exports.Wall = exports.Barrel = exports.Stone = exports.Crate = exports.Bush = exports.Tree = exports.OBSTACLE_SUPPLIERS = void 0;
const math_1 = require("../../types/math");
exports.OBSTACLE_SUPPLIERS = new Map();
var tree_1 = require("./tree");
Object.defineProperty(exports, "Tree", { enumerable: true, get: function () { return __importDefault(tree_1).default; } });
var bush_1 = require("./bush");
Object.defineProperty(exports, "Bush", { enumerable: true, get: function () { return __importDefault(bush_1).default; } });
var crate_1 = require("./crate");
Object.defineProperty(exports, "Crate", { enumerable: true, get: function () { return __importDefault(crate_1).default; } });
var stone_1 = require("./stone");
Object.defineProperty(exports, "Stone", { enumerable: true, get: function () { return __importDefault(stone_1).default; } });
var barrel_1 = require("./barrel");
Object.defineProperty(exports, "Barrel", { enumerable: true, get: function () { return __importDefault(barrel_1).default; } });
var wall_1 = require("./wall");
Object.defineProperty(exports, "Wall", { enumerable: true, get: function () { return __importDefault(wall_1).default; } });
var roof_1 = require("./roof");
Object.defineProperty(exports, "Roof", { enumerable: true, get: function () { return __importDefault(roof_1).default; } });
var toilet_1 = require("./toilet");
Object.defineProperty(exports, "Toilet", { enumerable: true, get: function () { return __importDefault(toilet_1).default; } });
var door_1 = require("./door");
Object.defineProperty(exports, "Door", { enumerable: true, get: function () { return __importDefault(door_1).default; } });
var toilet_more_1 = require("./toilet_more");
Object.defineProperty(exports, "ToiletMore", { enumerable: true, get: function () { return __importDefault(toilet_more_1).default; } });
var table_1 = require("./table");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return __importDefault(table_1).default; } });
var desk_1 = require("./desk");
Object.defineProperty(exports, "Desk", { enumerable: true, get: function () { return __importDefault(desk_1).default; } });
function castObstacle(minObstacle) {
    var _a;
    return (_a = exports.OBSTACLE_SUPPLIERS.get(minObstacle.type)) === null || _a === void 0 ? void 0 : _a.create(minObstacle);
}
exports.castObstacle = castObstacle;
function castMinObstacle(minMinObstacle) {
    const copy = minMinObstacle;
    return Object.assign(copy, { direction: math_1.Vec2.UNIT_X, hitbox: new math_1.CircleHitbox(0), despawn: false, animations: [] });
}
exports.castMinObstacle = castMinObstacle;
