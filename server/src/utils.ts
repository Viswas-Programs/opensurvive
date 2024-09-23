import * as crypto from "crypto";

// ID generator
export function ID() {
    return crypto.randomBytes(24).toString("hex");
}

// Promisified setTimeout
export function wait(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Maths
// Capping value with limits
export function clamp(val: number, min: number, max: number) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}
// Random between numbers
export function randomBetween(min: number, max: number) {
    return (Math.random() * (max - min)) + min;
}
export function randomBoolean() {
    return !!Math.floor(Math.random() * 2);
}
export function toRadians(degree: number) {
    return degree * Math.PI / 180;
}
export function distanceSqrTo(vec1: Vector, vec2: Vector) {
    return Vector.magnitudeSquared(Vector.sub(vec1, vec2));
}
export function equalVec(vec1: Vector, vec2: Vector) {
    return vec1.x == vec2.x && vec1.y == vec2.y;
}
export function vecFromArray(array: number[]) {
    return Vector.create(array[0], array[1]);
}

// Networking
import { encode, decode } from "msgpack-lite";
import { deflate, inflate } from "pako";
import WebSocket = require("ws");
import { ClientPacketResolvable, IPacket } from "./types/packet";
// Send packet
export function send(socket: WebSocket, packet: IPacket) {
    //socket.send(deflate(deflate(encode(packet).buffer)));
    socket.send(deflate(encode(packet).buffer));
}
// Receive packet
export function receive(msg: ArrayBuffer) {
    //return <ClientPacketResolvable>decode(inflate(inflate(new Uint8Array(msg))));
    return <ClientPacketResolvable>decode(inflate(new Uint8Array(msg)));
}

// Things that require game object imports
import { world } from ".";
import { Ammo, Gun, Grenade } from "./store/entities";
import { GunColor } from "./types/misc";
import fetch from "node-fetch";
import { Vector } from "matter-js";

// Spawners
export function spawnGun(id: string, color: GunColor, position: Vector, ammoAmount: number) {
    const gun = new Gun(id, color);
    gun.body.position = Vector.clone(position);
    world.spawn(gun);
    var halfAmmo = Math.round(ammoAmount/2)
    spawnAmmo(halfAmmo, color, position);
    spawnAmmo(ammoAmount - halfAmmo, color, position)
}
export function spawnAmmo(amount: number, color: GunColor, position: Vector) {
    const ammo = new Ammo(amount, color);
    ammo.body.position = Vector.clone(position);
    world.spawn(ammo);
}
export function spawnGrenade(id: string, amount: number, position: Vector){
    const grenade = new Grenade(id, amount);
    grenade.body.position = Vector.clone(position);
    world.spawn(grenade);
}
//Overall spawner to spawn any type of loot
export function spawnLoot(type: string, id: string, color: GunColor, position: Vector, amount: number){
    if(type == "ammo"){
        spawnAmmo(amount, color, position)
    }
}

// Networking
export function changeCurrency(accessToken: string, delta: number) {
    fetch((process.env.API_URL || "http://localhost:8000") + "/api/delta-currency", { method: "POST", headers: { "Authorization": "Bearer " + process.env.SERVER_DB_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify({ accessToken, delta }) })
        .catch(console.error);
}
export function addKillCounts(accessToken: string, delta: number) {
    fetch((process.env.API_URL || "http://localhost:8000") + "/api/killCount-delta", { method: "POST", headers: { "Authorization": "Bearer " + process.env.SERVER_DB_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify({ accessToken, delta }) })
        .catch(console.error);
}

// Minimizer
export function minimizeVector(vec: Vector) {
    return { x: vec.x, y: vec.y };
}

// Math optimization
export function vecDistCompare(a: Vector, b: Vector, dist: number, mode: "eq" | "ne" | "gt" | "ge" | "lt" | "le") {
    switch (mode) {
        case "eq": return Vector.magnitudeSquared(Vector.sub(a, b)) == dist * dist;
        case "ne": return Vector.magnitudeSquared(Vector.sub(a, b)) != dist * dist;
        case "gt": return Vector.magnitudeSquared(Vector.sub(a, b)) > dist * dist;
        case "ge": return Vector.magnitudeSquared(Vector.sub(a, b)) >= dist * dist;
        case "lt": return Vector.magnitudeSquared(Vector.sub(a, b)) < dist * dist;
        case "le": return Vector.magnitudeSquared(Vector.sub(a, b)) <= dist * dist;
    }
}