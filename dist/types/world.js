"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const entities_1 = require("../store/entities");
const math_1 = require("./math");
const obstacles_1 = require("../store/obstacles");
const particle_1 = require("./particle");
const particles_1 = require("../store/particles");
class World {
    constructor(size, defaultTerrain) {
        this.entities = [];
        this.obstacles = [];
        this.buildings = [];
        this.particles = [];
        this.terrains = [];
        this.aliveCount = 0;
        this.sounds = new Map();
        this.size = size;
        this.defaultTerrain = defaultTerrain;
        this.safeZone = this.nextSafeZone = { hitbox: new math_1.CircleHitbox(this.size.magnitude() * 0.5), position: this.size.scaleAll(0.5) };
    }
    clientTick(player) {
        for (const sound of this.sounds.values()) {
            const relative = sound.pos.addVec(player.position.inverse()).scaleAll(1 / 60);
            sound.howl.pos(relative.x, relative.y);
        }
        this.particles = this.particles.filter(p => !p.ended);
    }
    updateEntities(entities, discardEntities = []) {
        const pending = [];
        for (const entity of this.entities) {
            if (discardEntities.includes(entity.id))
                continue;
            const newData = entities.find(e => e.id == entity.id);
            if (newData)
                entity.copy(newData);
            pending.push(entity);
        }
        for (const entity of entities) {
            const existing = this.entities.find(e => e.id == entity.id);
            if (!existing)
                pending.push((0, entities_1.castEntity)(entity));
        }
        this.entities = pending;
    }
    updateObstacles(obstacles, discardObstacles = []) {
        const pending = [];
        for (const obstacle of this.obstacles) {
            if (discardObstacles.includes(obstacle.id))
                continue;
            const newData = obstacles.find(o => o.id == obstacle.id);
            if (newData)
                obstacle.copy(newData);
            pending.push(obstacle);
        }
        for (const obstacle of obstacles) {
            const existing = this.obstacles.find(o => o.id == obstacle.id);
            if (!existing) {
                const ob = (0, obstacles_1.castObstacle)(obstacle);
                if (ob)
                    pending.push(ob);
            }
        }
        this.obstacles = pending;
    }
    updateLiveCount(count) {
        this.aliveCount = count;
        document.getElementById("playercount").innerText = this.aliveCount.toString();
    }
    updateSafeZone(safeZone) {
        this.safeZone.hitbox = math_1.CircleHitbox.fromMinCircleHitbox(safeZone.hitbox);
        this.safeZone.position = math_1.Vec2.fromMinVec2(safeZone.position);
    }
    updateNextSafeZone(nextSafeZone) {
        this.nextSafeZone.hitbox = math_1.CircleHitbox.fromMinCircleHitbox(nextSafeZone.hitbox);
        this.nextSafeZone.position = math_1.Vec2.fromMinVec2(nextSafeZone.position);
    }
    addParticles(minParticles) {
        this.particles.push(...minParticles.map(p => (0, particles_1.castParticle)(p)).filter(p => p.id !== particle_1.DummyParticle.TYPE));
    }
}
exports.World = World;
