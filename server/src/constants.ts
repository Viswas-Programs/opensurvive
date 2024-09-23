import { Runner, Vector } from "matter-js";
import { CommonAngles, Vec2 } from "./types/math";
import * as fs from "fs";

//export const MAP_SIZE = [400, 400];
//small amount of players
export const MAP_SIZE = [200, 200]
export const TICKS_PER_SECOND = 45;
// Radius of 1x scope
export const BASE_RADIUS = 50;
export const DIRECTION_VEC = [Vec2.UNIT_X, Vec2.UNIT_X.addAngle(-CommonAngles.PI_TWO), Vec2.UNIT_X.addAngle(Math.PI), Vec2.UNIT_X.addAngle(CommonAngles.PI_TWO)];
export const PUSH_THRESHOLD = 1e-16;
// Translate original surviv.io game units to suit this one
export const GLOBAL_UNIT_MULTIPLIER = 1;
export const PLAYER_THRESHOLD = 2;

export const TSCONFIG = JSON.parse(fs.readFileSync("./tsconfig.json", { encoding: "utf8" }));

export const RUNNER = Runner.create({ delta: 1000 / TICKS_PER_SECOND, isFixed: true, enabled: true }); // Matter.js runner
export const LAYERS = 6; // Interaction layers
export const UNIT_X = Vector.create(1, 0);
export const UNIT_Y = Vector.create(0, 1);