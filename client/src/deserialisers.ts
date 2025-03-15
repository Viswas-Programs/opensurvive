import { IslandrBitStream } from "./packets"
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "./store/weapons"
import { Vec2} from "./types/math"
import { MinCircleHitbox, MinHitbox, MinObstacle, MinParticle, MinRectHitbox, MinVec2, MinWeapon } from "./types/minimized"
import { CountableString } from "./types/misc"
import { Weapon } from "./types/weapon"
import { Entity, Inventory } from "./types/entity"
import { TracerData } from "./types/data"
import { EntityTypes, NumToDeathImg, numToGunIDs, ObstacleTypes, SkinsDecoding } from "./constants"

const gunNumToID: Map<number, string> = new Map([
    [0, "fists"],
    [1, "cqbr"],
    [2, "mp9"],
    [3, "m18"],
    [4, "stf_12"],
    [5, "svd-m"]
])
let discardableEntitiesToRender: Entity[] = []
export function setDiscEntArray(ent = []){
    discardableEntitiesToRender = ent;
}
export function setItemToDiscEntArray(item: Entity) {
    discardableEntitiesToRender.push(item)
}
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
        const numofammo = stream.readInt16()
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
            const id = gunNumToID.get( stream.readInt8())!
            const weapon: MinWeapon = { nameId: id };

            if (castCorrectWeapon(weapon).type == "gun") { const mag = stream.readInt8(); weapons.push(castCorrectWeapon(weapon, mag)); }
            else { weapons.push(castCorrectWeapon(weapon)); }
        }
    }
    return <Weapon[]>weapons;
}
const healingIDsToNum: Map<number, string> = new Map([
    [0, "energy_drink"],
    [1, "medkit"],
    [2, "syringe"],
    [3, "tourniquet"]
])
function _getHealings(stream: IslandrBitStream): CountableString {
    const healingsJSON: CountableString = {}
    const size = stream.readInt8()
    for (let ii = 0; ii < size; ii++) {
        const indexer = healingIDsToNum.get( stream.readInt8())!
        const index = stream.readInt8()
        healingsJSON[indexer] = index
    }
    return healingsJSON
}
function _getHitboxes(stream: IslandrBitStream, callFrom = "others"): MinHitbox {
    let hitbox: MinHitbox;
    const hitboxTypeVal = stream.readInt8()
    if (hitboxTypeVal == 1) {
        if (callFrom != "player") {
            hitbox = <MinCircleHitbox>{
                type:"circle",
                radius: stream.readFloat32()
            }
        }
        else {
            hitbox = <MinCircleHitbox>{
                radius: stream.readInt8()
            }
        }
    }
    else {
        if (hitboxTypeVal == 3) { const HeightAndWidth = stream.readFloat32(); hitbox = <MinRectHitbox>{ type: "rect", height: HeightAndWidth, width: HeightAndWidth } }
        else {
            hitbox = <MinRectHitbox>{
                type: "rect",
                width: stream.readFloat32(),
                height: stream.readFloat32()
            }
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
            id: String(stream.readInt16()),
            type: stream.readInt8(),
            position: <MinVec2>{ x: stream.readFloat32(), y: stream.readFloat32() },
            direction: <MinVec2>{ x: stream.readFloat32(), y: stream.readFloat32() },
            hitbox: <MinHitbox>_getHitboxes(stream),
            despawn: stream.readBoolean(),
            animations: <string[]>_getAnimations(stream),
            roofless: new Set<string>(),
            special: "normal"
        }
        if (obstacle.type == ObstacleTypes.ROOF) {
            const size = stream.readInt8()
            if (size == 0) obstacle.roofless.clear()
            else {
                for (let ii = 0; ii < size; ii++) {
                    obstacle.roofless.add(String(stream.readInt16()))
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
        const type = stream.readInt8()
        const id = String(stream.readInt16())
        const position: MinVec2 = { x: stream.readFloat32(), y: stream.readFloat32() }
        const direction: MinVec2 = { x: stream.readFloat32(), y: stream.readFloat32() }
        //const hitbox = _getHitboxes(stream)
        const despawn = stream.readBoolean()
        const animations: string[] = []
        const baseMinEntity = {
            id: id,
            type: type,
            position: position,
            direction: direction,
            despawn: despawn,
            animations: animations,
        }
        if ([EntityTypes.VEST, EntityTypes.HELMET, EntityTypes.BACKPACK].includes(type)) {
            const minEntity = Object.assign(baseMinEntity, {
                level: stream.readInt8(),
                hitbox: <MinHitbox>{
                    type:"circle", radius:1.5}
                }
            )
            entities.push(minEntity);
        }
        else if (type == EntityTypes.SCOPE) {
            const minEntity = Object.assign(baseMinEntity, {
                zoom: stream.readInt8(),
                hitbox: <MinHitbox>{
                    type: "circle", radius: 1.5
                }            })
            entities.push(minEntity);
        }
        else if (type == EntityTypes.AMMO) {
            const minEntity = Object.assign(baseMinEntity, {
                amount: stream.readInt16(), color: stream.readInt8(),
                hitbox: <MinHitbox>{
                    type: "rect", width: 2, height: 2,
                } })
            entities.push(minEntity)
        }
        else if (type == EntityTypes.BULLET) {
            const minEntity = Object.assign(baseMinEntity, {
                tracer: <TracerData>{
                    type: stream.readASCIIString(), length: stream.readFloat64(), width: stream.readFloat64()
                },
                    hitbox: _getHitboxes(stream)
                    })
            entities.push(minEntity)
        }
        else if (type == EntityTypes.EXPLOSION) {
            const minEntity = Object.assign(baseMinEntity, { health: stream.readInt8(), maxHealth: stream.readInt8(), hitbox: _getHitboxes(stream) })
            entities.push(minEntity)
        }
        else if ([EntityTypes.HEALING, EntityTypes.GRENADELOOT].includes(type)) {
            const minEntity = Object.assign(baseMinEntity, {
                nameId: stream.readId(),
                hitbox: <MinHitbox>{
                    type: "circle", radius: 1.3
                }
})
            entities.push(minEntity)
        }
        else if (type == EntityTypes.GUN) {
            baseMinEntity.animations = _getAnimations(stream)
            const minEntity = Object.assign(baseMinEntity, {
                nameId: stream.readASCIIString(), color: stream.readInt8(),
                hitbox: <MinHitbox>{
                    type: "circle", radius: 2
                } })
            entities.push(minEntity)
        }
        else if (type == EntityTypes.PLAYER) { //We are using else if here due to debug grenade testing. 
            baseMinEntity.animations = _getAnimations(stream)
            console.log(baseMinEntity)
            const player = Object.assign(baseMinEntity, {
                username: stream.readASCIIString(),
                inventory: {
                    backpackLevel: stream.readInt8(),
                    helmetLevel: stream.readInt8(),
                    vestLevel: stream.readInt8(),
                    holding: castCorrectWeapon(<MinWeapon>{nameId: numToGunIDs.get(stream.readInt8())})
                },
                skin: SkinsDecoding.get(stream.readInt8()),
                deathImg: NumToDeathImg.get(stream.readInt8()),
                hitbox: <MinHitbox>{
                    type: "circle", radius: 1
                }
            })
            entities.push(player)
        }
        else if (type == EntityTypes.GRENADE){
            const grenade = Object.assign(baseMinEntity, {
                hitbox: <MinHitbox>{
                    type: "circle", radius: 1
                }
            });
            entities.push(baseMinEntity)
            console.log(baseMinEntity.type, 'from deserialiser.ts')
        }
    }
    if (discardableEntitiesToRender.length) discardableEntitiesToRender.forEach(ent => entities.push(ent));
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
let username: string | null;
let id: string | null ;
let deathImg : string | null;
export function setUsrnameIdDeathImg(array: Array<string> | Array<null>) {
    username = array[0];
    id = array[1];
    deathImg = array[2]
}
function _getUsername(stream: IslandrBitStream) {
    if (!username) username = stream.readUsername()
    return username
}
function _getUserID(stream: IslandrBitStream) {
    if (!id) id = String( stream.readInt16())
    return id
}
function _getUserDeathImg(stream: IslandrBitStream) {
    if (!deathImg) deathImg = NumToDeathImg.get(stream.readInt8())!
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
        type: EntityTypes.PLAYER,  //constantly 6  bytes :D
        currentHealItem: _getCurrentHealItem(stream),
        interactMessage: _getInteractMessage(stream),
        hitbox: <MinCircleHitbox>{
            type: "circle",
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
        skin: SkinsDecoding.get(stream.readInt8()),
        deathImg: _getUserDeathImg(stream),
        reloadTicks: stream.readInt16(),
        maxReloadTicks: stream.readInt16(),
        healTicks: stream.readInt16(),
        maxHealTicks: stream.readInt16(),
        health: stream.readInt8(),
        maxHealth: 100,
        position: Vec2.fromMinVec2(<MinVec2>{
            x: stream.readFloat32(),
            y: stream.readFloat32()
        }),
        direction: Vec2.fromMinVec2(<MinVec2>{
            x: stream.readFloat32(),
            y: stream.readFloat32()
        }),
        animations: _getAnimations(stream),
        despawn: stream.readBoolean()
    }
    return playerSrvr;
}

export function deserialiseDiscardables(stream: IslandrBitStream): string[] {
    const discardables: string[] = []
    const size = stream.readInt8()
    if (size == 0 ) return []
    for (let ii = 0; ii < size; ii++) {
        const discardable = String(stream.readInt16());
        discardables.push(discardable)
    }
    return discardables
}