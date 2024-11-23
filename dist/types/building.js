"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const math_1 = require("./math");
class Building {
    constructor(minBuilding) {
        this.zones = [];
        this.id = minBuilding.id;
        this.position = math_1.Vec2.fromMinVec2(minBuilding.position);
        this.direction = math_1.Vec2.fromMinVec2(minBuilding.direction);
        this.zones = minBuilding.zones.map(zone => ({ position: math_1.Vec2.fromMinVec2(zone.position), hitbox: math_1.Hitbox.fromMinHitbox(zone.hitbox), map: zone.map }));
        this.color = minBuilding.color;
    }
    renderMap(_canvas, ctx, scale) {
        if (this.color === undefined || !this.zones.length)
            return;
        ctx.scale(scale, scale);
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction.angle());
        ctx.fillStyle = (0, utils_1.numToRGBA)(this.color);
        for (const zone of this.zones) {
            if (!zone.map)
                continue;
            if (zone.hitbox.type === "circle")
                (0, utils_1.circleFromCenter)(ctx, zone.position.x, zone.position.y, zone.hitbox.comparable);
            else {
                const rect = zone.hitbox;
                const topLeft = zone.position.addVec(new math_1.Vec2(-rect.width / 2, -rect.height / 2));
                const botRight = zone.position.addVec(new math_1.Vec2(rect.width / 2, rect.height / 2));
                const dimension = botRight.addVec(topLeft.inverse());
                ctx.fillRect(topLeft.x, topLeft.y, dimension.x, dimension.y);
            }
        }
        ctx.resetTransform();
    }
}
exports.default = Building;
