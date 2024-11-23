"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiecewiseTerrain = exports.LineTerrain = exports.DotTerrain = exports.FullTerrain = exports.Terrain = void 0;
const terrains_1 = require("../store/terrains");
const math_1 = require("./math");
const utils_1 = require("../utils");
class Terrain {
    constructor(minTerrain) {
        this.type = "generic";
        // Use RGB
        this.color = 0;
        this.aboveTerrainLine = false;
        this.id = minTerrain.id;
    }
    colorToHex(color) {
        if (!color)
            color = this.color;
        return "#" + color.toString(16);
    }
    setColour(color) {
        if (!color)
            return this;
        this.color = color;
        return this;
    }
}
exports.Terrain = Terrain;
class FullTerrain extends Terrain {
    render(_you, _canvas, _ctx, _scale) { }
    renderMap(_canvas, _ctx, _scale) { }
}
exports.FullTerrain = FullTerrain;
class DotTerrain extends Terrain {
    constructor(minTerrain) {
        super(minTerrain);
        this.type = "dot";
        this.position = new math_1.Vec2(minTerrain.position.x, minTerrain.position.y);
        this.radius = minTerrain.radius;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.fillStyle = this.colorToHex();
        (0, utils_1.circleFromCenter)(ctx, 0, 0, this.radius * scale);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.fillStyle = this.colorToHex();
        (0, utils_1.circleFromCenter)(ctx, this.position.x * scale, this.position.y * scale, this.radius * scale);
    }
}
exports.DotTerrain = DotTerrain;
class LineTerrain extends Terrain {
    constructor(minTerrain) {
        super(minTerrain);
        this.type = "line";
        this.line = math_1.Line.fromMinLine(minTerrain.line);
        this.range = minTerrain.range;
        this.boundary = { start: math_1.Vec2.fromMinVec2(minTerrain.boundary[0]), end: math_1.Vec2.fromMinVec2(minTerrain.boundary[1]) };
    }
    render(you, canvas, ctx, scale) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-you.position.x, -you.position.y);
        const lines = this.line.toParallel(this.range, false);
        const start = new math_1.Line(this.line.a, this.boundary.start.addVec(this.line.a), false);
        const end = new math_1.Line(this.line.b, this.boundary.end.addVec(this.line.b), false);
        const a = lines[0].intersection(start);
        if (!a)
            return;
        const b = lines[0].intersection(end);
        if (!b)
            return;
        const c = lines[1].intersection(end);
        if (!c)
            return;
        const d = lines[1].intersection(start);
        if (!d)
            return;
        ctx.fillStyle = this.colorToHex();
        ctx.beginPath();
        ctx.moveTo(a.x - 1 / scale, a.y - 1 / scale);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x - 1 / scale, d.y - 1 / scale);
        ctx.closePath();
        ctx.fill();
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.scale(scale, scale);
        const lines = this.line.toParallel(this.range, false);
        const start = new math_1.Line(this.line.a, this.boundary.start.addVec(this.line.a), false);
        const end = new math_1.Line(this.line.b, this.boundary.end.addVec(this.line.b), false);
        const a = lines[0].intersection(start);
        if (!a)
            return;
        const b = lines[0].intersection(end);
        if (!b)
            return;
        const c = lines[1].intersection(end);
        if (!c)
            return;
        const d = lines[1].intersection(start);
        if (!d)
            return;
        ctx.fillStyle = this.colorToHex();
        ctx.beginPath();
        ctx.moveTo(a.x - 1 / scale, a.y - 1 / scale);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x - 1 / scale, d.y - 1 / scale);
        ctx.closePath();
        ctx.fill();
        ctx.resetTransform();
    }
}
exports.LineTerrain = LineTerrain;
class PiecewiseTerrain extends Terrain {
    constructor(minTerrain) {
        super(minTerrain);
        this.type = "piecewise";
        this.lines = [];
        for (const line of minTerrain.lines)
            this.lines.push((0, terrains_1.castTerrain)(line));
    }
    render(you, canvas, ctx, scale) {
        this.lines.forEach(line => line.render(you, canvas, ctx, scale));
    }
    renderMap(canvas, ctx, scale) {
        this.lines.forEach(line => line.renderMap(canvas, ctx, scale));
    }
}
exports.PiecewiseTerrain = PiecewiseTerrain;
