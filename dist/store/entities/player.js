"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullPlayer = exports.PartialPlayer = void 0;
const _1 = require(".");
const constants_1 = require("../../constants");
const languages_1 = require("../../languages");
const textures_1 = require("../../textures");
const entity_1 = require("../../types/entity");
const weapon_1 = require("../../types/weapon");
const utils_1 = require("../../utils");
const weapons_1 = require("../weapons");
const homepage_1 = require("../../homepage");
const weaponPanelDivs = [];
const weaponNameDivs = [];
const weaponImages = [];
for (let ii = 0; ii < 4; ii++) {
    weaponPanelDivs.push(document.getElementById("weapon-panel-" + ii));
    weaponNameDivs.push(document.getElementById("weapon-name-" + ii));
    weaponImages.push(document.getElementById("weapon-image-" + ii));
}
if (!localStorage.getItem("playerSkin")) {
    localStorage.setItem("playerSkin", "default");
}
class PlayerSupplier {
    create(minEntity) {
        return new PartialPlayer(minEntity);
    }
}
class Player extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Player.TYPE;
        this.zIndex = 9;
        this.currentSkinImg = new Image();
        this.currentDeathImg = new Image();
        this.interactMessage = null;
        this.currentHealItem = null;
        this.pickedAmmo = false;
        this.copy(minEntity);
        this.currentSkinImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/skins/" + this.skin + ".svg";
        this.currentDeathImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/entities/" + this.deathImg + ".svg";
    }
    copy(minEntity) {
        var _a, _b, _c;
        super.copy(minEntity);
        this.username = minEntity.username;
        this.skin = minEntity.skin;
        this.deathImg = minEntity.deathImg;
        this.interactMessage = minEntity.interactMessage;
        if (typeof minEntity.inventory.holding === "number") {
            const inventory = minEntity.inventory;
            this.inventory = new entity_1.Inventory(inventory.holding, inventory.slots, inventory.weapons.map(w => w ? (0, weapons_1.castCorrectWeapon)(w, w.type == weapon_1.WeaponType.GUN ? w.magazine : 0) : w), inventory.ammos, inventory.utilities, inventory.healings);
            this.inventory.backpackLevel = inventory.backpackLevel;
            this.inventory.vestLevel = inventory.vestLevel;
            this.inventory.helmetLevel = inventory.helmetLevel;
            for (let ii = 0; ii < inventory.weapons.length; ii++) {
                if (ii == inventory.holding)
                    weaponPanelDivs[ii].classList.add("selected");
                else
                    weaponPanelDivs[ii].classList.remove("selected");
                weaponNameDivs[ii].innerHTML = ((_a = inventory.weapons[ii]) === null || _a === void 0 ? void 0 : _a.nameId) ? (0, languages_1.translate)(constants_1.LANG, `hud.weapon.${(_b = inventory.weapons[ii]) === null || _b === void 0 ? void 0 : _b.nameId}`) : "&nbsp;";
                const path = (0, textures_1.getWeaponImagePath)((_c = inventory.weapons[ii]) === null || _c === void 0 ? void 0 : _c.nameId);
                if (weaponImages[ii].path != path) {
                    weaponImages[ii].path = path;
                    weaponImages[ii].src = path;
                }
            }
            for (const key of Object.keys(this.inventory.healings)) {
                document.getElementById("healing-count-" + _1.Healing.mapping.indexOf(key)).innerHTML = `${this.inventory.healings[key]}`;
                if (this.inventory.healings[key])
                    document.getElementById("healing-panel-" + _1.Healing.mapping.indexOf(key)).classList.add("enabled");
                else
                    document.getElementById("healing-panel-" + _1.Healing.mapping.indexOf(key)).classList.remove("enabled");
            }
            this.inventory.scopes = inventory.scopes;
            this.inventory.selectedScope = inventory.selectedScope;
        }
        else
            this.inventory = new entity_1.PartialInventory(minEntity.inventory);
        if (this.despawn)
            this.zIndex = 7;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        const radius = scale * this.hitbox.comparable;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        if (!this.despawn) {
            ctx.rotate(this.direction.angle());
            if (this.inventory.backpackLevel) {
                ctx.fillStyle = "#675230";
                ctx.lineWidth = radius / 6;
                ctx.strokeStyle = "#000000";
                (0, utils_1.circleFromCenter)(ctx, -radius * 0.2 * (1 + this.inventory.backpackLevel), 0, radius * 0.9, true, true);
            }
            if (this.inventory.vestLevel) {
                ctx.fillStyle = "#675230";
                ctx.lineWidth = radius / (7 - this.inventory.vestLevel);
                ctx.strokeStyle = "#000000";
                (0, utils_1.circleFromCenter)(ctx, 0, 0, radius, true, true);
            }
            if (this.currentSkinImg.complete)
                ctx.drawImage(this.currentSkinImg, -radius, -radius, radius * 2, radius * 2);
            if (this.inventory.helmetLevel) {
                if (this.inventory.helmetLevel == 1)
                    ctx.fillStyle = "#0000FF";
                else if (this.inventory.helmetLevel == 2)
                    ctx.fillStyle = "#808080";
                else if (this.inventory.helmetLevel == 3)
                    ctx.fillStyle = "#A9A9A9";
                else if (this.inventory.helmetLevel == 4)
                    ctx.fillStyle = "#000000";
                else
                    ctx.fillStyle = "#ff00ff";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000000";
                (0, utils_1.circleFromCenter)(ctx, 0, 0, radius * 0.7, true, true);
            }
            // We will leave the transform for the weapon
            // If player is holding nothing, render fist
            var weapon = weapons_1.WEAPON_SUPPLIERS.get("fists").create();
            if (typeof this.inventory.holding === "number")
                weapon = this.inventory.getWeapon();
            else
                weapon = this.inventory.holding;
            weapon.render(this, canvas, ctx, scale);
            ctx.resetTransform();
        }
        else {
            if (this.currentDeathImg.complete)
                ctx.drawImage(this.currentDeathImg, -radius * 2, -radius * 2, radius * 4, radius * 4);
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = `700 ${scale}px Jura`;
            ctx.fillStyle = "#60605f";
            ctx.fillText(this.username, 2, radius * 2 + 2);
            ctx.fillStyle = "#80807f";
            ctx.fillText(this.username, 0, radius * 2);
            ctx.resetTransform();
        }
    }
}
Player.TYPE = "player";
exports.default = Player;
class PartialPlayer extends Player {
}
exports.PartialPlayer = PartialPlayer;
(() => {
    _1.ENTITY_SUPPLIERS.set(Player.TYPE, new PlayerSupplier());
})();
class FullPlayer extends Player {
    copy(minEntity) {
        super.copy(minEntity);
        this.health = minEntity.health;
        this.maxHealth = minEntity.maxHealth;
        this.boost = minEntity.boost;
        this.maxBoost = minEntity.maxBoost;
        this.interactMessage = minEntity.interactMessage;
        this.currentHealItem = minEntity.currentHealItem;
        this.scope = minEntity.scope;
        this.canInteract = minEntity.canInteract || false;
        this.reloadTicks = minEntity.reloadTicks;
        this.maxReloadTicks = minEntity.maxReloadTicks;
        this.healTicks = minEntity.healTicks;
        this.maxHealTicks = minEntity.maxHealTicks;
    }
}
exports.FullPlayer = FullPlayer;
