"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawPrompt = drawPrompt;
const constants_1 = require("../constants");
const game_1 = require("../game");
const languages_1 = require("../languages");
const math_1 = require("../types/math");
const utils_1 = require("../utils");
function drawPrompt(player, canvas, ctx, scale) {
    drawInteract(player, canvas, ctx);
    drawReloading(player, canvas, ctx);
    drawHealing(player, canvas, ctx);
}
function drawInteract(player, canvas, ctx) {
    var _a;
    if (player.despawn || !player.canInteract)
        return;
    const size = canvas.height / 36;
    ctx.font = `${size}px Jura bold`;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    const metric = ctx.measureText(`[${constants_1.KeyBind.INTERACT.toUpperCase()}] Pick up ${player.interactMessage}`);
    const yOffset = canvas.height / 24;
    const padding = canvas.height / 72;
    const width = metric.width + padding * 2;
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.5;
    (0, utils_1.roundRect)(ctx, (canvas.width - width) / 2, canvas.height / 2 + yOffset, width, size + 2 * padding, canvas.height / 108);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 1;
    const split = (_a = player.interactMessage) === null || _a === void 0 ? void 0 : _a.split(" ");
    if (split)
        ctx.fillText((0, languages_1.translate)(constants_1.LANG, split.shift(), constants_1.KeyBind.INTERACT.toUpperCase(), split ? (0, languages_1.translate)(constants_1.LANG, split.shift(), ...split) : ""), canvas.width / 2, canvas.height / 2 + padding + yOffset);
}
function drawReloading(player, canvas, ctx) {
    if (!player.reloadTicks)
        return;
    drawCircleLoading(player.reloadTicks, player.maxReloadTicks, (0, languages_1.translate)(constants_1.LANG, "prompt.reload"), canvas, ctx);
}
function drawHealing(player, canvas, ctx) {
    if (!player.healTicks)
        return;
    drawCircleLoading(player.healTicks, player.maxHealTicks, (0, languages_1.translate)(constants_1.LANG, "prompt.heal", (0, languages_1.translate)(constants_1.LANG, player.currentHealItem)), canvas, ctx);
}
function drawCircleLoading(remain, max, message, canvas, ctx) {
    const size = canvas.height / 36;
    ctx.font = `${size}px Jura bold`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const yOffset = canvas.height / 24 + size * 2;
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.5;
    (0, utils_1.circleFromCenter)(ctx, canvas.width / 2, canvas.height / 2 - yOffset, size * 2, true, false);
    ctx.strokeStyle = "#fff";
    ctx.globalAlpha = 1;
    ctx.lineWidth = size / 4;
    (0, utils_1.strokeArc)(ctx, canvas.width / 2, canvas.height / 2 - yOffset, size * 2 - ctx.lineWidth / 2, -math_1.CommonAngles.PI_TWO, -math_1.CommonAngles.PI_TWO + math_1.CommonAngles.TWO_PI * (max - remain) / max);
    ctx.fillStyle = "#fff";
    ctx.fillText((remain / (0, game_1.getTPS)()).toFixed(2) + "s", canvas.width / 2, canvas.height / 2 - yOffset);
    const padding = size / 4;
    const metric = ctx.measureText(message);
    const width = metric.width + padding * 2;
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.5;
    (0, utils_1.roundRect)(ctx, (canvas.width - width) / 2, canvas.height / 2 - yOffset * 2 - padding, width, size + 2 * padding, canvas.height / 108);
    ctx.globalAlpha = 1;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#fff";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - yOffset * 2 + size);
}
