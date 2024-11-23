"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = init;
const _1 = require(".");
const animation_1 = require("../../types/animation");
const math_1 = require("../../types/math");
const LEFT_FIST = new animation_1.DefinedAnimation("left_fist", [new math_1.Vec2(0, -1), math_1.Vec2.UNIT_X, new math_1.Vec2(0, -1)], Array(3).fill(math_1.Vec2.UNIT_X), [0, 0.5, 1], 250);
const RIGHT_FIST = new animation_1.DefinedAnimation("right_fist", [new math_1.Vec2(0, 1), math_1.Vec2.UNIT_X, new math_1.Vec2(0, 1)], Array(3).fill(math_1.Vec2.UNIT_X), [0, 0.5, 1], 250);
function init() {
    _1.DEFINED_ANIMATIONS.set(LEFT_FIST.id, LEFT_FIST);
    _1.DEFINED_ANIMATIONS.set(RIGHT_FIST.id, RIGHT_FIST);
}
