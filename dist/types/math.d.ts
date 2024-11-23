import { MinCircleHitbox, MinHitbox, MinLine, MinRectHitbox, MinVec2 } from "./minimized";
import { CollisionType } from "./misc";
export declare class Vec2 {
    static readonly ZERO: Vec2;
    static readonly UNIT_X: Vec2;
    static readonly UNIT_Y: Vec2;
    static fromMinVec2(minVec2: MinVec2): Vec2;
    static fromArray(array: number[]): Vec2;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    magnitudeSqr(): number;
    magnitude(): number;
    inverse(): Vec2;
    unit(): Vec2;
    dot(vec: Vec2): number;
    angleBetween(vec: Vec2): number;
    angle(): number;
    addAngle(radian: number): Vec2;
    addVec(vec: Vec2): Vec2;
    addX(x: number): Vec2;
    addY(y: number): Vec2;
    scale(x: number, y: number): Vec2;
    scaleAll(ratio: number): Vec2;
    projectTo(vec: Vec2): Vec2;
    distanceSqrTo(vec: Vec2): number;
    distanceTo(vec: Vec2): number;
    perpendicular(): Vec2;
    equals(vec: Vec2): boolean;
    minimize(): MinVec2;
}
export declare class Line {
    static fromMinLine(minLine: MinLine): Line;
    static fromPointSlope(p: Vec2, m: number): Line;
    static fromArrays(arr: number[][]): Line;
    static fromPointVec(p: Vec2, vec: Vec2): Line;
    readonly a: Vec2;
    readonly b: Vec2;
    segment: boolean;
    constructor(a: Vec2, b: Vec2, segment?: boolean);
    direction(point: Vec2): number;
    distanceSqrTo(point: Vec2): number;
    distanceTo(point: Vec2): number;
    intersects(line: Line): boolean;
    on(p: Vec2): boolean;
    passthrough(point: Vec2): boolean;
    leftTo(point: Vec2): boolean;
    rightTo(point: Vec2): boolean;
    slope(): number | undefined;
    yIntercept(): number | undefined;
    toVec(): Vec2;
    toParallel(distance: number, overrideSegment?: boolean): Line[];
    intersection(line: Line): Vec2 | undefined;
    minimize(): MinLine;
}
export declare abstract class Hitbox {
    type: "rect" | "circle";
    comparable: number;
    static fromMinHitbox(minHitbox: MinHitbox): RectHitbox | CircleHitbox;
    static fromNumber(args: number[] | number): RectHitbox | CircleHitbox;
    constructor(type: "rect" | "circle", comparable: number);
    abstract scaleAll(ratio: number): Hitbox;
    abstract lineIntersects(line: Line, position: Vec2, direction: Vec2): boolean;
    abstract inside(point: Vec2, position: Vec2, direction: Vec2): boolean;
    abstract collideRect(position: Vec2, direction: Vec2, hitbox: RectHitbox, position1: Vec2, direction1: Vec2): CollisionType;
    abstract collideCircle(position: Vec2, direction: Vec2, hitbox: CircleHitbox, position1: Vec2, direction1: Vec2): CollisionType;
    abstract minimize(): MinHitbox;
}
export declare class RectHitbox extends Hitbox {
    static readonly ZERO: RectHitbox;
    static fromMinRectHitbox(minRectHitbox: MinRectHitbox): RectHitbox;
    static fromArray(array: number[]): RectHitbox;
    width: number;
    height: number;
    constructor(width: number, height: number);
    scaleAll(ratio: number): RectHitbox;
    lineIntersects(line: Line, position: Vec2, direction: Vec2): boolean;
    inside(point: Vec2, position: Vec2, direction: Vec2): boolean;
    collideRect(position: Vec2, direction: Vec2, hitbox: RectHitbox, position1: Vec2, direction1: Vec2): CollisionType.NONE | CollisionType.RECT_RECT;
    collideCircle(position: Vec2, direction: Vec2, hitbox: CircleHitbox, position1: Vec2, _direction1: Vec2): CollisionType.NONE | CollisionType.CIRCLE_RECT_CENTER_INSIDE | CollisionType.CIRCLE_RECT_POINT_INSIDE | CollisionType.CIRCLE_RECT_LINE_INSIDE;
    minimize(): MinRectHitbox;
    private isLeft;
    private pointInRect;
}
export declare class CircleHitbox extends Hitbox {
    static readonly ZERO: RectHitbox;
    static fromMinCircleHitbox(minCircleHitbox: MinCircleHitbox): CircleHitbox;
    radius: number;
    constructor(radius: number);
    scaleAll(ratio: number): CircleHitbox;
    lineIntersects(line: Line, center: Vec2): boolean;
    inside(point: Vec2, position: Vec2, direction: Vec2): boolean;
    collideRect(position: Vec2, direction: Vec2, hitbox: RectHitbox, position1: Vec2, direction1: Vec2): CollisionType.NONE | CollisionType.CIRCLE_RECT_CENTER_INSIDE | CollisionType.CIRCLE_RECT_POINT_INSIDE | CollisionType.CIRCLE_RECT_LINE_INSIDE;
    collideCircle(position: Vec2, _direction: Vec2, hitbox: CircleHitbox, position1: Vec2, _direction1: Vec2): CollisionType.NONE | CollisionType.CIRCLE_CIRCLE;
    minimize(): MinCircleHitbox;
}
export declare enum CommonAngles {
    PI_FOUR,
    PI_TWO,
    TWO_PI
}
export declare enum CommonNumbers {
    SIN45
}
export declare class Polygon {
    points: Vec2[];
    constructor(points: Vec2[], position?: Vec2);
    inside(p: Vec2): boolean;
}
