import { IslandrBitStream } from "./packets"
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "./store/weapons"
import { Vec2} from "./types/math"
import { MinCircleHitbox, MinHitbox, MinObstacle, MinParticle, MinRectHitbox, MinVec2, MinWeapon } from "./types/minimized"
import { CountableString } from "./types/misc"
import { Weapon } from "./types/weapon"
import { Inventory } from "./types/entity"
import { TracerData } from "./types/data"
export function deserialiseMinParticles(stream: IslandrBitStream): MinParticle[]{
    const particles: MinParticle[] = []
    for (let ii = 0; ii < stream.readInt8(); ii++) {
        const particle: MinParticle = {
            id: stream.readId(),
            position: <MinVec2>{ x: stream.readFloat64(), y: stream.readFloat64() },
            size: stream.readFloat32()
        }
        particles.push(particle)
    }
    return particles
}
function _getUtilities(stream: IslandrBitStream): CountableString {
    const utilities: CountableString = {}
    for (let ii = 0; ii < stream.readInt8(); ii++) {
        utilities[stream.readASCIIString(15)] = stream.readInt8()
    }
    return utilities
}

function _getAmmos(stream: IslandrBitStream): number[] {
    const ammos: number[] = []
    const size = stream.readInt8()
    for (let ii = 0; ii < size; ii++) {
        const numofammo = stream.readInt8()
        ammos[ii] = numofammo
    }
    return ammos
}

function _getScopes(stream: IslandrBitStream): number[] {
    const numOfScopes = stream.readInt8()
    const scopes: number[] = []
    for (let ii = 0; ii < numOfScopes; ii++) {
        scopes.push(stream.readInt8())
    }
    return scopes
}
function _getWeapons(stream: IslandrBitStream): Weapon[] {
    const weapons = [];
    for (let ii = 0; ii < 4; ii++) {
        const weaponExistOrNot = stream.readBoolean()
        if (!weaponExistOrNot) weapons.push(null)
        else {
            const id = stream.readASCIIString()
            const weapon: MinWeapon = { nameId: id };

            if (castCorrectWeapon(weapon).type == "gun") { const mag = stream.readInt8(); weapons.push(castCorrectWeapon(weapon, mag)); }
            else { weapons.push(castCorrectWeapon(weapon)); }
        }
    }
    return <Weapon[]>weapons;
}
function _getHealings(stream: IslandrBitStream): CountableString {
    const healingsJSON: CountableString = {}
    const size = stream.readInt8()
    for (let ii = 0; ii < size; ii++) {
        const indexer = stream.readHealingItem()
        const index = stream.readInt8()
        healingsJSON[indexer] = index
    }
    return healingsJSON
}
function _getHitboxes(stream: IslandrBitStream, callFrom = "others"): MinHitbox {
    let hitbox: MinHitbox;
    if (stream.readBoolean()) {
        if (callFrom != "player") {
            hitbox = <MinCircleHitbox>{
                type:"circle",
                radius: stream.readFloat64()
            }
        }
        else {
            hitbox = <MinCircleHitbox>{
                radius: stream.readInt8()
            }
        }
    }
    else {
        hitbox = <MinRectHitbox>{
            type: "rect",
            width: stream.readFloat64(),
            height: stream.readFloat64()
        }
    }
    return hitbox
}
function _getAnimations(stream: IslandrBitStream): string[] {
    const animations: string[] = [];
    const size = stream.readInt8();
    for (let ii = 0; ii < size ; ii++) {
        const animation: string = stream.readASCIIString()
        animations.push(animation)
    }
    return animations
}

export function deserialiseMinObstacles(stream: IslandrBitStream): MinObstacle[] {
    const obstacles: MinObstacle[] = [];
    const size = stream.readInt8();
    for (let ii = 0; ii < size; ii++) {
        let obstacle = {
            id: stream.readId(),
            type: stream.readASCIIString(),
            position: <MinVec2>{ x: stream.readFloat64(), y: stream.readFloat64() },
            direction: <MinVec2>{ x: stream.readFloat64(), y: stream.readFloat64() },
            hitbox: <MinHitbox>_getHitboxes(stream),
            despawn: stream.readBoolean(),
            animations: <string[]>_getAnimations(stream),
            roofless: new Set<string>(),
            special: "normal"
        }
        if (obstacle.type == "roof") {
            const size = stream.readInt8()
            if (size == 0) obstacle.roofless.clear()
            else {
                for (let ii = 0; ii < size; ii++) {
                    obstacle.roofless.add(stream.readId())
                }
            }
            obstacle = Object.assign(obstacle, {
                color: stream.readInt32(),
                texture: {path: stream.readASCIIString(), horizontalFill: stream.readInt8()}
            })
        }
        const specialOrNot = stream.readBoolean()
        if (specialOrNot) obstacle.special = stream.readASCIIString()
        obstacles.push(<MinObstacle>obstacle)
    }
    return obstacles
}

export function deserialiseMinEntities(stream: IslandrBitStream) {
    const entities = [];
    const size = stream.readInt8()
    for (let ii = 0; ii < size; ii++) {
        const type = stream.readASCIIString()
        const id = stream.readId()
        const position: MinVec2 = { x: stream.readFloat64(), y: stream.readFloat64() }
        const direction: MinVec2 = { x: stream.readFloat64(), y: stream.readFloat64() }
        const hitbox = _getHitboxes(stream)
        const despawn = stream.readBoolean()
        const animations = _getAnimations(stream)
        const baseMinEntity = {
            id: id,
            type: type,
            position: position,
            direction: direction,
            hitbox: hitbox,
            despawn: despawn,
            animations: animations,
        }
        if (["vest", "helmet", "backpack"].includes(type)) {
            const minEntity = Object.assign(baseMinEntity, { level: stream.readInt8() })
            entities.push(minEntity);
        }
        else if (type == "scope") {
            const minEntity = Object.assign(baseMinEntity, { zoom: stream.readInt8() })
            entities.push(minEntity);
        }
        else if (type == "ammo") {
            const minEntity = Object.assign(baseMinEntity, { amount: stream.readInt8(), color: stream.readInt8() })
            entities.push(minEntity)
        }
        else if (type == "bullet") {
            const minEntity = Object.assign(baseMinEntity, { tracer: <TracerData>{ type: stream.readASCIIString(11), length: stream.readFloat64(), width: stream.readFloat64() } })
            entities.push(minEntity)
        }
        else if (type == "explosion") {
            const minEntity = Object.assign(baseMinEntity, { health: stream.readInt8(), maxHealth: stream.readInt8() })
            entities.push(minEntity)
        }
        else if (["grenade", "healing"].includes(type)) {
            const minEntity = Object.assign(baseMinEntity, { nameId: stream.readId() })
            entities.push(minEntity)
        }
        else if (type == "gun") {
            const minEntity = Object.assign(baseMinEntity, { nameId: stream.readASCIIString(13), color: stream.readInt8() })
            entities.push(minEntity)
        }
        else {
            const player = Object.assign(baseMinEntity, {
                username: stream.readASCIIString(),
                inventory: {
                    backpackLevel: stream.readInt8(),
                    helmetLevel: stream.readInt8(),
                    vestLevel: stream.readInt8(),
                    holding: castCorrectWeapon(<MinWeapon>{nameId: stream.readId()})
                },
                skin: stream.readSkinOrLoadout(),
                deathImg: stream.readSkinOrLoadout()
            })
            entities.push(player)
        }
    }
    return entities;
}
function _getCurrentHealItem(stream: IslandrBitStream): string | null {
    const curHealItemExists = stream.readBoolean()
    if (!curHealItemExists) return null;
    else {
        const curHealItem = stream.readHealingItem();
        return `entity.healing.${curHealItem}`
    }
}
let username = "";
let id = "";
let deathImg = "";

function _getUsername(stream: IslandrBitStream) {
    if (username == "") username = stream.readUsername()
    return username
}
function _getUserID(stream: IslandrBitStream) {
    if (id == "") id = stream.readId()
    return id
}
function _getUserDeathImg(stream: IslandrBitStream) {
    if (deathImg == "") deathImg = stream.readSkinOrLoadout()
    else deathImg = "default"
    return deathImg
}
function _getInteractMessage(stream: IslandrBitStream): string | null {
    const interactMsgExists = stream.readBoolean()
    if (!interactMsgExists) return null
    else return stream.readASCIIString()
}
export function deserialisePlayer(stream: IslandrBitStream) {
    const playerSrvr: any = {
        type: "player",  //constantly 6  bytes :D
        currentHealItem: _getCurrentHealItem(stream),
        interactMessage: _getInteractMessage(stream),
        hitbox: <MinCircleHitbox>{
            radius: 1
        }, // hitbox radius
        id: _getUserID(stream), // id of player
        username: _getUsername(stream),
        boost: stream.readFloat32(),
        maxBoost: 100,
        scope: stream.readInt8(),
        canInteract: stream.readBoolean(),
        inventory: <Inventory> {
            backpackLevel: stream.readInt8(),
            helmetLevel: stream.readInt8(),//inventory's helmetLevel
            vestLevel: stream.readInt8(),// inventory vestLevel
            holding: <number>stream.readInt8(), // inventory holding currently
            weapons: _getWeapons(stream),
            healings: _getHealings(stream),
            scopes: _getScopes(stream),
            utilities: _getUtilities(stream),
            slots: [],
            ammos: _getAmmos(stream),
            selectedScope: stream.readInt8(),
            getWeapon: (index = -1) =>  {
                if (index < 0) index = playerSrvr.inventory.holding as number;
                if (playerSrvr.inventory.holding < (playerSrvr.inventory as Inventory).weapons.length) return (playerSrvr.inventory as Inventory).weapons[playerSrvr.inventory.holding as number];
                const util = Object.keys((playerSrvr.inventory as Inventory).utilities)[playerSrvr.inventory.holding as number - (playerSrvr.inventory as Inventory).weapons.length];
                if ((playerSrvr.inventory as Inventory).utilities[util]) return WEAPON_SUPPLIERS.get(util)!.create();
                return undefined;
            }
        },
        skin: stream.readSkinOrLoadout(),
        deathImg: _getUserDeathImg(stream),
        reloadTicks: stream.readInt16(),
        maxReloadTicks: stream.readInt16(),
        healTicks: stream.readInt16(),
        maxHealTicks: stream.readInt16(),
        health: stream.readInt8(),
        maxHealth: 100,
        position: Vec2.fromMinVec2(<MinVec2>{
            x: stream.readFloat64(),
            y: stream.readFloat64()
        }),
        direction: Vec2.fromMinVec2(<MinVec2>{
            x: stream.readFloat64(),
            y: stream.readFloat64()
        }),
        animations: _getAnimations(stream),
        despawn: stream.readBoolean()
    }
    return playerSrvr;
}

export function deserialiseDiscardables(stream: IslandrBitStream): string[] {
    const discardables: string[] = []
    const size = stream.readInt8()
    for (let ii = 0; ii < size; ii++) {
        const discardable = stream.readASCIIString();
        discardables.push(discardable)
    }
    return discardables
}