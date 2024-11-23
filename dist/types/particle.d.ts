import { Player } from "../store/entities";
import { Vec2 } from "./math";
import { MinParticle } from "./minimized";
export declare abstract class Particle {
    id: string;
    type: string;
    position: Vec2;
    size: number;
    ended: boolean;
    zIndex: number;
    constructor(minParticle: MinParticle);
    abstract renderTick(time: number): void;
    abstract render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class DummyParticle extends Particle {
    static readonly TYPE = "dummy";
    type: string;
    renderTick(): void;
    render(): void;
}
export declare abstract class FadeParticle extends Particle {
    type: string;
    duration: number;
    fadeStart: number;
    constructor(minParticle: MinParticle & {
        duration: number;
        fadeStart: number;
    });
    renderTick(time: number): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    abstract actualRender(ctx: CanvasRenderingContext2D): void;
}
export declare class TextureFadeParticle extends FadeParticle {
    static readonly particleImages: Map<string, HTMLImageElement>;
    type: string;
    texture?: string;
    direction: Vec2;
    angle: number;
    constructor(minParticle: MinParticle & {
        duration: number;
        fadeStart: number;
    });
    renderTick(time: number): void;
    actualRender(ctx: CanvasRenderingContext2D): void;
}
export declare class GrowFadeParticle extends FadeParticle {
    type: string;
    color: number;
    growSpeed: number;
    constructor(minParticle: MinParticle & {
        duration: number;
        fadeStart: number;
        color: number;
        growSpeed: number;
    });
    colorToHex(color?: number): string;
    renderTick(time: number): void;
    actualRender(ctx: CanvasRenderingContext2D): void;
}
