"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunColor = exports.MovementDirection = exports.CollisionType = void 0;
var CollisionType;
(function (CollisionType) {
    // No intersection
    CollisionType[CollisionType["NONE"] = 0] = "NONE";
    // Circle-circle intersection
    CollisionType[CollisionType["CIRCLE_CIRCLE"] = 1] = "CIRCLE_CIRCLE";
    // Rectangle-rectangle intersection
    CollisionType[CollisionType["RECT_RECT"] = 2] = "RECT_RECT";
    // Circle-rectangle intersection, with the circle's center inside the rectangle
    CollisionType[CollisionType["CIRCLE_RECT_CENTER_INSIDE"] = 3] = "CIRCLE_RECT_CENTER_INSIDE";
    // Circle-rectangle intersection, with point(s) of the rectangle inside the circle
    CollisionType[CollisionType["CIRCLE_RECT_POINT_INSIDE"] = 4] = "CIRCLE_RECT_POINT_INSIDE";
    // Circle-rectangle intersection, with line(s) of the rectangle inside the circle
    CollisionType[CollisionType["CIRCLE_RECT_LINE_INSIDE"] = 5] = "CIRCLE_RECT_LINE_INSIDE";
})(CollisionType = exports.CollisionType || (exports.CollisionType = {}));
// The 4 movement directions
var MovementDirection;
(function (MovementDirection) {
    MovementDirection[MovementDirection["RIGHT"] = 0] = "RIGHT";
    MovementDirection[MovementDirection["UP"] = 1] = "UP";
    MovementDirection[MovementDirection["LEFT"] = 2] = "LEFT";
    MovementDirection[MovementDirection["DOWN"] = 3] = "DOWN";
})(MovementDirection = exports.MovementDirection || (exports.MovementDirection = {}));
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
})(GunColor = exports.GunColor || (exports.GunColor = {}));
