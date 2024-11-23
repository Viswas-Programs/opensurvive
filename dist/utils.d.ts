export declare function wait(ms: number): Promise<unknown>;
export declare function clamp(val: number, min: number, max: number): number;
export declare function toDegrees(radian: number): number;
export declare function numToRGBA(num: number, overrideAlpha?: number): string;
export declare function twoDigits(num: number | string): string;
import { ServerPacketResolvable, IPacket } from "./types/packet";
import { CommonAngles } from "./types/math";
export declare function send(socket: WebSocket, packet: IPacket): void;
export declare function receive(msg: ArrayBuffer): ServerPacketResolvable;
export declare function circleFromCenter(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill?: boolean, stroke?: boolean): void;
export declare function strokeArc(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, start?: number, end?: CommonAngles, counter?: boolean): void;
export declare function lineBetween(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, stroke?: boolean): void;
export declare function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | {
    tl?: number;
    tr?: number;
    br?: number;
    bl?: number;
}, fill?: boolean, stroke?: boolean): void;
export declare function loadoutChange(accessToken: string, skin: string, delta: number): void;
