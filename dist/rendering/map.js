"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMap = initMap;
exports.drawMap = drawMap;
exports.drawMinimap = drawMinimap;
const constants_1 = require("../constants");
const game_1 = require("../game");
const states_1 = require("../states");
const utils_1 = require("../utils");
const mapCanvas = document.createElement("canvas");
var mapCtx;
var constScale;
const tmpCanvas = document.createElement("canvas");
// Initialize the map when MapPacket is received
function initMap() {
    // Determine the dimension
    const size = game_1.world.size;
    const maxSide = Math.max(size.x, size.y);
    const minScreen = Math.min(window.screen.availWidth, window.screen.availHeight);
    mapCanvas.width = minScreen * size.x / maxSide;
    mapCanvas.height = minScreen * size.y / maxSide;
    constScale = minScreen / maxSide;
    const scale = mapCanvas.width / game_1.world.size.x;
    mapCtx = mapCanvas.getContext("2d");
    // Fill map background
    mapCtx.fillStyle = game_1.world.defaultTerrain.colorToHex();
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    // Draw terrains on map, -ve layer -> layer 0
    game_1.world.terrains.filter((terrain) => !!terrain["renderMapLayerN1"]).forEach(terrain => terrain.renderMapLayerN1(mapCanvas, mapCtx, scale));
    game_1.world.terrains.forEach(terrain => terrain.renderMap(mapCanvas, mapCtx, scale));
    // Draw the grid
    mapCtx.strokeStyle = "#000000";
    mapCtx.lineWidth = 1;
    mapCtx.globalAlpha = 0.2;
    for (let ii = 0; ii <= size.x; ii += constants_1.GRID_INTERVAL)
        (0, utils_1.lineBetween)(mapCtx, ii * minScreen / maxSide, 0, ii * minScreen / maxSide, mapCanvas.height);
    for (let ii = 0; ii <= size.y; ii += constants_1.GRID_INTERVAL)
        (0, utils_1.lineBetween)(mapCtx, 0, ii * minScreen / maxSide, mapCanvas.width, ii * minScreen / maxSide);
    mapCtx.globalAlpha = 1;
    // Draw buildings on map
    const buildings = game_1.world.buildings;
    buildings.forEach(building => building.renderMap(mapCanvas, mapCtx, scale));
    // Draw obstacles on map, -ve layer -> layer 0
    const obstacles = game_1.world.obstacles.sort((a, b) => a.zIndex - b.zIndex);
    obstacles.filter((obstacle) => !!obstacle["renderMapLayerN1"]).forEach(obstacle => obstacle.renderMapLayerN1(mapCanvas, mapCtx, scale));
    obstacles.forEach(obstacle => obstacle.renderMap(mapCanvas, mapCtx, scale));
}
// Draw world map
function drawMap(canvas, ctx) {
    // Determine the dimension
    const scaleByWidth = canvas.width / mapCanvas.width;
    const scaleByHeight = canvas.height / mapCanvas.height;
    var width, height, scale;
    if (scaleByHeight * mapCanvas.width > canvas.width) {
        width = canvas.width;
        height = scaleByWidth * mapCanvas.height;
        scale = canvas.width / game_1.world.size.x;
    }
    else {
        width = scaleByHeight * mapCanvas.width;
        height = canvas.height;
        scale = canvas.height / game_1.world.size.y;
    }
    // Draw pre-rendered map
    ctx.drawImage(mapCanvas, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    // Draw safe zone circle
    const zoneCanvas = document.createElement("canvas");
    zoneCanvas.width = width;
    zoneCanvas.height = height;
    const zoneCtx = zoneCanvas.getContext("2d");
    zoneCtx.fillStyle = "#fff";
    (0, utils_1.circleFromCenter)(zoneCtx, game_1.world.safeZone.position.x * scale, game_1.world.safeZone.position.y * scale, game_1.world.safeZone.hitbox.radius * scale);
    zoneCtx.globalCompositeOperation = "source-out";
    zoneCtx.fillStyle = "#f00";
    zoneCtx.globalAlpha = 0.6;
    zoneCtx.fillRect(0, 0, zoneCanvas.width, zoneCanvas.height);
    /*zoneCtx.globalAlpha = 1;
    zoneCtx.strokeStyle = "#fff";
    zoneCtx.lineWidth = 2;
    zoneCtx.globalCompositeOperation = "source-over";
    circleFromCenter(zoneCtx, world.nextSafeZone.position.x * scale, world.nextSafeZone.position.y * scale, world.nextSafeZone.hitbox.radius * scale, false, true);*/
    ctx.drawImage(zoneCanvas, (canvas.width - width) / 2, (canvas.height - height) / 2);
    // Draw border around map
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    // Draw player icon
    const player = (0, game_1.getPlayer)();
    ctx.fillStyle = "#F8C675";
    (0, utils_1.circleFromCenter)(ctx, (canvas.width - width) / 2 + player.position.x * scale, (canvas.height - height) / 2 + player.position.y * scale, 8);
    (0, utils_1.circleFromCenter)(ctx, (canvas.width - width) / 2 + player.position.x * scale, (canvas.height - height) / 2 + player.position.y * scale, 12, false, true);
}
// Draw minimap
function drawMinimap(player, canvas, ctx) {
    // Determine the dimension
    const size = constants_1.MINIMAP_SIZE * constScale * ((0, states_1.isBigMap)() ? 1.5 : 1);
    const x = player.position.x * constScale - size / 2;
    const y = player.position.y * constScale - size / 2;
    const imageData = mapCtx.getImageData(x, y, size, size);
    tmpCanvas.width = tmpCanvas.height = size;
    const tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.putImageData(imageData, 0, 0);
    // Draw safe zone circle
    const zoneCanvas = document.createElement("canvas");
    zoneCanvas.width = tmpCanvas.width;
    zoneCanvas.height = tmpCanvas.height;
    const zoneCtx = zoneCanvas.getContext("2d");
    zoneCtx.fillStyle = "#fff";
    (0, utils_1.circleFromCenter)(zoneCtx, -x + game_1.world.safeZone.position.x * constScale, -y + game_1.world.safeZone.position.y * constScale, game_1.world.safeZone.hitbox.radius * constScale);
    zoneCtx.globalCompositeOperation = "source-out";
    zoneCtx.fillStyle = "#f00";
    zoneCtx.globalAlpha = 0.6;
    zoneCtx.fillRect(0, 0, zoneCanvas.width, zoneCanvas.height);
    /*zoneCtx.globalAlpha = 1;
    zoneCtx.strokeStyle = "#fff";
    zoneCtx.lineWidth = 2;
    zoneCtx.globalCompositeOperation = "source-over";
    circleFromCenter(zoneCtx, -x + world.nextSafeZone.position.x * constScale, -y + world.nextSafeZone.position.y * constScale, world.nextSafeZone.hitbox.radius * constScale, false, true);*/
    tmpCtx.drawImage(zoneCanvas, 0, 0);
    // Draw safe zone circle
    /*tmpCtx.strokeStyle = "#fff";
    tmpCtx.lineWidth = 2;
    circleFromCenter(tmpCtx, -x + world.safeZone.position.x * constScale, -y + world.safeZone.position.y * constScale, world.safeZone.hitbox.radius * constScale, false, true);*/
    const margin = canvas.width / 100;
    const side = canvas.width / (8 / ((0, states_1.isBigMap)() ? 1.5 : 1));
    // Fill map background
    ctx.fillStyle = game_1.world.defaultTerrain.colorToHex();
    ctx.fillRect(margin, canvas.height - margin - side, side, side);
    // Draw pre-rendered map
    ctx.drawImage(tmpCanvas, margin, canvas.height - margin - side, side, side);
    // Draw border around map
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, canvas.height - margin - side, side, side);
    // Draw the player icon
    ctx.fillStyle = "#F8C675";
    (0, utils_1.circleFromCenter)(ctx, margin + side / 2, canvas.height - margin - side / 2, 8);
    (0, utils_1.circleFromCenter)(ctx, margin + side / 2, canvas.height - margin - side / 2, 12, false, true);
}
