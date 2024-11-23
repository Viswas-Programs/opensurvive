export declare enum CollisionType {
    NONE = 0,
    CIRCLE_CIRCLE = 1,
    RECT_RECT = 2,
    CIRCLE_RECT_CENTER_INSIDE = 3,
    CIRCLE_RECT_POINT_INSIDE = 4,
    CIRCLE_RECT_LINE_INSIDE = 5
}
export declare enum MovementDirection {
    RIGHT = 0,
    UP = 1,
    LEFT = 2,
    DOWN = 3
}
export declare enum GunColor {
    YELLOW = 0,
    RED = 1,
    BLUE = 2,
    GREEN = 3,
    BLACK = 4,
    OLIVE = 5,
    ORANGE = 6,
    PURPLE = 7,
    TEAL = 8,
    BROWN = 9,
    PINK = 10,
    PURE_BLACK = 11,
    CURSED = 12,
    BUGLE = 13
}
export type CountableString = {
    [key: string]: number;
};
