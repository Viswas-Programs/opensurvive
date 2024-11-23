"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const terrain_1 = require("../../types/terrain");
class BeachSupplier {
    create(minTerrain) {
        return new Beach(minTerrain);
    }
}
class Beach extends terrain_1.LineTerrain {
    constructor() {
        super(...arguments);
        this.id = Beach.ID;
        this.color = 0xceb35c;
    }
}
Beach.ID = "beach";
(() => {
    _1.TERRAIN_SUPPLIERS.set(Beach.ID, new BeachSupplier());
})();
exports.default = Beach;
