import { Player } from ".";
import { world } from "../..";
import { EntityTypes, GLOBAL_UNIT_MULTIPLIER, ObstacleTypes } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser, writeHitboxes } from "../../serialisers";
import { TracerData } from "../../types/data";
import { Entity } from "../../types/entity";
import { CircleHitbox, Line, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import Explosion from "./explosion";

export default class Grenade extends Entity {
    type = EntityTypes.GRENADE;
    collisionLayers = [0];
    thrower: Entity | Obstacle;
    dmg: number;
    despawning = false;
    falloff: number;
    distanceSqr = 0;
    oldPos?: Vec2;
    velocityStage1?: Vec2;
    velocityStage2?: Vec2;
    currentStage: number;
    ticksStageChangePoint: number;
    constructor(thrower: Entity | Obstacle, dmg: number, velocity: Vec2, ticks: number, falloff: number) {
        super();
        this.hitbox = new CircleHitbox(1)//data.width * GLOBAL_UNIT_MULTIPLIER * 0.5);
        this.thrower = thrower;
        //this.data = data;
        this.dmg = dmg;
        this.direction = this.velocity = velocity;
        this.health = this.maxHealth = ticks;
        this.discardable = true;
        this.vulnerable = false;
        this.falloff = falloff;
        //this.allocBytes += 44;
        this.velocityStage1 = velocity
        this.velocityStage2 = velocity.scaleAll(0.5)
        this.currentStage = 1
        this.ticksStageChangePoint = this.health - (this.health/3)
        this.airborne = true;
        this._needsToSendAnimations = false;
    }
    collisionCheck(entities: Entity[], obstacles: Obstacle[]) {
        if (this.despawn) return;
        var combined: (Entity | Obstacle)[] = [];
        combined = combined.concat(entities, obstacles);
        for (const thing of combined) {
            if (this.type == thing.type || thing.despawn) continue;
            if (this.airborne && !(thing instanceof Obstacle)) continue;
            if (this.airborne && thing.type != ObstacleTypes.WALL) continue;
            if (thing.collided(this)) {
                if (thing.type === EntityTypes.PLAYER && this.thrower.type === EntityTypes.PLAYER && thing.id != this.thrower.id) { (<any>this.thrower).damageDone += this.dmg; }
                thing.damage(this.dmg, this.thrower.id);
                this.setVelocity(Vec2.ZERO)
                //if (thing.surface == "metal") { this.position = this.position.addVec(this.direction.invert()); this.setVelocity(this.direction.invert()); this.direction = this.direction.invert() }
                break;
            }
            if (this.type != thing.type && !thing.despawn && thing.hitbox.lineIntersects(new Line(this.position, this.position.addVec(this.velocity)), thing.position, thing.direction)) {
                if (thing.type === EntityTypes.PLAYER && this.thrower.type === EntityTypes.PLAYER && thing.id != this.thrower.id) { (<any>this.thrower).damageDone += this.dmg; }
                this.setVelocity(Vec2.ZERO)
                break;
            }

        }
        for (const thing of obstacles) {
            if (this.oldPos && !thing.despawn && thing.hitbox.lineIntersects(new Line(this.oldPos.addVec(this.velocity.inverse()), this.position.addVec(this.velocity), true), thing.position, thing.direction)) {
                this.setVelocity(Vec2.ZERO)
                if (!thing.noCollision) this.die();
                break;
            }
        }
    }
    damage(dmg: number, damager?: string): void {
        this.dmg -= dmg * 0.3
    }
    tick(entities: Entity[], obstacles: Obstacle[]) {
        this.velocity = this.velocity.addVec(Vec2.fromArray([-this.health/3000, -this.health/3000]))
        const entitiesToCheck = []
        const obstaclesToCheck = []
        for (let ii = 0; ii < entities.length; ii++) {
            if (entities[ii].type != EntityTypes.PLAYER && entities[ii].despawn) continue;
            entitiesToCheck.push(entities[ii])
        }
        for (let ii = 0; ii < obstacles.length; ii++) {
            if (obstacles[ii].despawn) continue;
            obstaclesToCheck.push(obstacles[ii])
        }
        const lastPos = this.position;
        super.tick(entities, obstacles);
        this.distanceSqr += this.position.addVec(lastPos.inverse()).magnitudeSqr();
        if (this.distanceSqr >= 10000) this.dmg *= this.falloff;
        if (this.health < this.ticksStageChangePoint){
            this.currentStage = 2; 
            this.airborne = false;
            this.velocity = this.velocity.addVec(Vec2.fromArray([-this.health/1500, -this.health/1500]))
        }
        this.collisionCheck(entitiesToCheck, obstaclesToCheck);

        if (!this.despawn) {
            this.health--;
            if (this.health <= 0) this.die();
        }
    }

    die() {
        super.die();
        world.entities.push(new Explosion(this, 150, 50, this.position, (this.hitbox.comparable*1.5), 5, 20));
        // Needs a state marker to determine what particle gets played
        //addParticles(new Particle("blood", this.position));
    }

    serialise(stream: IslandrBitStream, player: Player) {
        standardEntitySerialiser(this.minimize(), stream, player)
        //writeHitboxes(this.hitbox.minimize(), stream)
    //write the hitbox configuration
    }
}