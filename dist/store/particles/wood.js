"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const particle_1 = require("../../types/particle");
class WoodSupplier {
    create(minParticle) {
        return new Wood(minParticle);
    }
}
class Wood extends particle_1.TextureFadeParticle {
    constructor(minParticle) {
        super(Object.assign(minParticle, { duration: 1000, fadeStart: 1000 }));
        this.id = Wood.ID;
        this.texture = "wood";
    }
}
Wood.ID = "wood";
(() => {
    _1.PARTICLE_SUPPLIERS.set(Wood.ID, new WoodSupplier());
})();
exports.default = Wood;
