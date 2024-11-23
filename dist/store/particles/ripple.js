"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const particle_1 = require("../../types/particle");
class RippleSupplier {
    create(minParticle) {
        return new Ripple(minParticle);
    }
}
class Ripple extends particle_1.GrowFadeParticle {
    constructor(minParticle) {
        super(Object.assign(minParticle, { duration: 1000, fadeStart: 1000, color: 0x7ec8ea, growSpeed: 1 }));
        this.id = Ripple.ID;
        this.zIndex = 0;
    }
}
Ripple.ID = "ripple";
(() => {
    _1.PARTICLE_SUPPLIERS.set(Ripple.ID, new RippleSupplier());
})();
exports.default = Ripple;
