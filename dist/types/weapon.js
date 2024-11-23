"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyWeapon = exports.GrenadeWeapon = exports.GunWeapon = exports.MeleeWeapon = exports.Weapon = exports.WeaponType = void 0;
const utils_1 = require("../utils");
const math_1 = require("./math");
const animations_1 = require("../store/animations");
const textures_1 = require("../textures");
const homepage_1 = require("../homepage");
var WeaponType;
(function (WeaponType) {
    WeaponType["MELEE"] = "melee";
    WeaponType["GUN"] = "gun";
    WeaponType["GRENADE"] = "grenade";
})(WeaponType || (exports.WeaponType = WeaponType = {}));
class Weapon {
    constructor(nameId) {
        this.nameId = nameId;
    }
}
exports.Weapon = Weapon;
class MeleeWeapon extends Weapon {
    constructor(nameId, _data) {
        super(nameId);
        this.type = WeaponType.MELEE;
    }
    render(player, _canvas, ctx, scale) {
        const radius = scale * player.hitbox.radius;
        const fistScale = radius * 1.2 * math_1.CommonNumbers.SIN45;
        const fistExtend = math_1.Vec2.UNIT_X.scaleAll(fistScale);
        const fists = [];
        if (!MeleeWeapon.FIST_ANIMATIONS.some(a => player.animations.find(aa => aa.id == a))) {
            fists.push(fistExtend.addVec(fistExtend.addAngle(math_1.CommonAngles.PI_TWO)));
            fists.push(fistExtend.addVec(fistExtend.addAngle(-math_1.CommonAngles.PI_TWO)));
        }
        else {
            for (const animation of player.animations) {
                const anim = animations_1.DEFINED_ANIMATIONS.get(animation.id);
                if (anim) {
                    const index = MeleeWeapon.FIST_ANIMATIONS.indexOf(animation.id);
                    const portion = (anim.duration - animation.duration) / anim.duration;
                    for (let ii = 0; ii < anim.keyframes.length - 1; ii++) {
                        if (portion >= anim.keyframes[ii] && portion <= anim.keyframes[ii + 1]) {
                            const position = anim.positions[ii].addVec(anim.positions[ii + 1].addVec(anim.positions[ii].inverse()).scaleAll((portion - anim.keyframes[ii]) / (anim.keyframes[ii + 1] - anim.keyframes[ii]))).scaleAll(fistScale);
                            // TODO: handle rotation
                            //const rotation = anim.rotations[ii]
                            fists.push(fistExtend.addVec(position));
                            break;
                        }
                    }
                    fists.push(fistExtend.addVec(fistExtend.addAngle(math_1.CommonAngles.PI_TWO * (-index * 2 + 1))));
                }
            }
        }
        const fistRadius = radius / 3;
        ctx.lineWidth = fistRadius / 3;
        ctx.strokeStyle = "#000000";
        const img = MeleeWeapon.fistImages.get(player.skin);
        if (!img) {
            const newImg = new Image();
            MeleeWeapon.fistImages.set(player.skin, newImg);
            newImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/fists/" + player.skin + ".svg";
        }
        else if (img.complete)
            for (const fist of fists) {
                //circleFromCenter(ctx, fist.x, fist.y, fistRadius, true, true);
                ctx.drawImage(img, fist.x - fistRadius, fist.y - fistRadius, fistRadius * 2, fistRadius * 2);
            }
    }
}
exports.MeleeWeapon = MeleeWeapon;
MeleeWeapon.fistImages = new Map();
MeleeWeapon.FIST_ANIMATIONS = ["left_fist", "right_fist"];
class GunWeapon extends Weapon {
    constructor(nameId, data, magazine = 0) {
        super(nameId);
        this.type = WeaponType.GUN;
        this.color = data.color;
        this.length = data.length;
        this.hasBarrelImage = data.visuals.hasBarrelImage;
        this.magazine = magazine;
    }
    render(player, _canvas, ctx, scale) {
        const radius = scale * player.hitbox.comparable;
        const fistRadius = radius / 3;
        const fistPositions = [new math_1.Vec2(player.hitbox.comparable, 0.1), new math_1.Vec2(player.hitbox.comparable + 0.25, -0.1)];
        var offset = math_1.Vec2.ZERO;
        ctx.fillStyle = "#222";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.025 * scale;
        if (!this.hasBarrelImage)
            (0, utils_1.roundRect)(ctx, player.hitbox.comparable * scale, -0.15 * scale, this.length * scale, 0.3 * scale, 0.15 * scale, true, true);
        else {
            const img = GunWeapon.barrelImages.get(this.nameId);
            if (!(img === null || img === void 0 ? void 0 : img.complete)) {
                if (!img) {
                    const image = new Image();
                    image.src = (0, textures_1.getBarrelImagePath)(this.nameId);
                    GunWeapon.barrelImages.set(this.nameId, image);
                }
                (0, utils_1.roundRect)(ctx, player.hitbox.comparable * scale, -0.15 * scale, this.length * scale, 0.3 * scale, 0.15 * scale, true, true);
            }
            else
                ctx.drawImage(img, player.hitbox.comparable * scale, -this.length * scale / 2, this.length * scale, this.length * scale);
        }
        ctx.lineWidth = fistRadius / 3;
        ctx.strokeStyle = "#000000";
        const img = MeleeWeapon.fistImages.get(player.skin);
        if (!img) {
            const newImg = new Image();
            MeleeWeapon.fistImages.set(player.skin, newImg);
            newImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/fists/" + player.skin + ".svg";
        }
        else if (img.complete)
            for (const pos of fistPositions) {
                const fist = pos.addVec(offset).scaleAll(scale);
                ctx.drawImage(img, fist.x - fistRadius, fist.y - fistRadius, fistRadius * 2, fistRadius * 2);
            }
    }
}
exports.GunWeapon = GunWeapon;
GunWeapon.barrelImages = new Map();
class GrenadeWeapon extends Weapon {
    constructor() {
        super(...arguments);
        this.type = WeaponType.GRENADE;
        //type!: "frag" | "mirv" | "smoke";
    }
}
exports.GrenadeWeapon = GrenadeWeapon;
// Dummy weapon
class DummyWeapon extends Weapon {
    render(_player, _canvas, _ctx, _scale) { }
}
exports.DummyWeapon = DummyWeapon;
