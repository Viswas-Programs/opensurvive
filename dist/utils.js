"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = wait;
exports.clamp = clamp;
exports.toDegrees = toDegrees;
exports.numToRGBA = numToRGBA;
exports.twoDigits = twoDigits;
exports.send = send;
exports.receive = receive;
exports.circleFromCenter = circleFromCenter;
exports.strokeArc = strokeArc;
exports.lineBetween = lineBetween;
exports.roundRect = roundRect;
exports.loadoutChange = loadoutChange;
// Promisified setTimeout
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
// Maths
// Capping value with limits
function clamp(val, min, max) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
// Converts radian to degrees
function toDegrees(radian) {
    return radian * 180 / Math.PI;
}
// Colors
// Converting number to RGBA
function numToRGBA(num, overrideAlpha) {
    const a = overrideAlpha === undefined ? num % 256 : overrideAlpha;
    const b = (num >>> 8) % 256;
    const g = (num >>> 16) % 256;
    const r = (num >>> 24) % 256;
    return `#${twoDigits(r.toString(16))}${twoDigits(g.toString(16))}${twoDigits(b.toString(16))}${twoDigits(a.toString(16))}`;
}
// Strings
// Make numbers 2 digits
function twoDigits(num) {
    if (typeof num === "string") {
        const str = num;
        if (str.length <= 1)
            return Array(2 - str.length).fill("0").join("") + str;
        else
            return str;
    }
    else {
        if (num < 10)
            return `0${num}`;
        else
            return num.toString();
    }
}
// Networking
const msgpack_lite_1 = require("msgpack-lite");
const pako_1 = require("pako");
const math_1 = require("./types/math");
// Send packet
function send(socket, packet) {
    //socket.send(deflate(deflate(encode(packet).buffer)));
    socket.send((0, pako_1.deflate)((0, msgpack_lite_1.encode)(packet).buffer));
}
// Receive packet
function receive(msg) {
    //return <ServerPacketResolvable>decode(inflate(inflate(new Uint8Array(msg))));
    return (0, msgpack_lite_1.decode)((0, pako_1.inflate)(new Uint8Array(msg)));
}
// Rendering
// Draws circle with x, y center
function circleFromCenter(ctx, x, y, radius, fill = true, stroke = false) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, math_1.CommonAngles.TWO_PI, false);
    ctx.closePath();
    if (fill)
        ctx.fill();
    if (stroke)
        ctx.stroke();
}
function strokeArc(ctx, x, y, radius, start = 0, end = math_1.CommonAngles.TWO_PI, counter = false) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, counter);
    ctx.stroke();
    ctx.closePath();
}
// Strokes a line between (x1, y1) and (x2, y2)
function lineBetween(ctx, x1, y1, x2, y2, stroke = true) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    if (stroke)
        ctx.stroke();
}
// Draws a rounded rectangle
function roundRect(ctx, x, y, width, height, radius, fill = true, stroke = false) {
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    var tl, tr, bl, br;
    if (typeof radius === 'number')
        tl = tr = bl = br = radius;
    else {
        tl = radius.tl || 0;
        tr = radius.tr || 0;
        br = radius.br || 0;
        bl = radius.bl || 0;
    }
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + width - tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
    ctx.lineTo(x + width, y + height - br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    ctx.lineTo(x + bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
    ctx.lineTo(x, y + tl);
    ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.closePath();
    if (fill)
        ctx.fill();
    if (stroke)
        ctx.stroke();
}
function loadoutChange(accessToken, skin, delta) {
    fetch((process.env.API_URL || "http://localhost:8000") + "/api/currency-decrement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken, delta }) })
        .catch(console.error);
    fetch((process.env.API_URL || "http://localhost:8000") + "/api/addSkins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken, skin }) })
        .catch(console.error);
}
