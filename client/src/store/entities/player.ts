import { addListener } from "process";
import { ENTITY_SUPPLIERS, Healing } from ".";
import { getWeaponImagePath } from "../../textures";
import { Entity, Inventory, PartialInventory } from "../../types/entity";
import { MinEntity, MinInventory } from "../../types/minimized";
import { EntitySupplier } from "../../types/supplier";
import { GunWeapon, WeaponType } from "../../types/weapon";
import { circleFromCenter } from "../../utils";
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "../weapons";

const weaponPanelDivs: HTMLDivElement[] = [];
const weaponNameDivs: HTMLDivElement[] = [];
const weaponImages: (HTMLImageElement & { path: string })[] = [];
for (let ii = 0; ii < 4; ii++) {
	weaponPanelDivs.push(<HTMLDivElement> document.getElementById("weapon-panel-" + ii));
	weaponNameDivs.push(<HTMLDivElement> document.getElementById("weapon-name-" + ii));
	weaponImages.push(<HTMLImageElement & { path: string }> document.getElementById("weapon-image-" + ii));
}

const deathImg: HTMLImageElement & { loaded: boolean } = Object.assign(new Image(), { loaded: false });
deathImg.onload = () => deathImg.loaded = true;
deathImg.src = "assets/images/game/entities/death.svg";
if (!localStorage.getItem("playerSkin")){ localStorage.setItem("playerSkin", "default")}
interface AdditionalEntity {
	id: string;
	username: string;
	boost: number;
	maxBoost: number;
	scope: number;
	inventory: MinInventory | Inventory;
	canInteract?: boolean;
	health: number;
	maxHealth: number;
	reloadTicks: number;
	maxReloadTicks: number;
	healTicks: number;
	maxHealTicks: number;
	skin: string | null;
}

class PlayerSupplier implements EntitySupplier {
	create(minEntity: MinEntity & AdditionalEntity) {
		return new PartialPlayer(minEntity);
	}
}

export default class Player extends Entity {
	static readonly TYPE = "player";
	type = Player.TYPE;
	id!: string;
	username!: string;
	skin!: string | null
	inventory!: PartialInventory | Inventory;
	zIndex = 9;
	currentSkinSVG: HTMLImageElement & { loaded: boolean } = Object.assign(new Image(), { loaded: false });

	constructor(minEntity: MinEntity & AdditionalEntity) {
		super(minEntity);
		this.copy(minEntity);
	}

	copy(minEntity: MinEntity & AdditionalEntity) {
		super.copy(minEntity);
		this.username = minEntity.username;
		this.skin = minEntity.skin;
		if (typeof minEntity.inventory.holding === "number") {
			const inventory = <Inventory>minEntity.inventory;
			this.inventory = new Inventory(inventory.holding, inventory.slots, inventory.weapons.map(w => w ? castCorrectWeapon(w, w.type == WeaponType.GUN ? (<GunWeapon>w).magazine : 0) : w), inventory.ammos, inventory.utilities, inventory.healings);
			this.inventory.backpackLevel = inventory.backpackLevel;
			for (let ii = 0; ii < inventory.weapons.length; ii++) {
				if (ii == inventory.holding) weaponPanelDivs[ii].classList.add("selected");
				else weaponPanelDivs[ii].classList.remove("selected");
				weaponNameDivs[ii].innerHTML = inventory.weapons[ii]?.name || "&nbsp;";
				const path = getWeaponImagePath(inventory.weapons[ii]?.id);
				if (weaponImages[ii].path != path) {
					weaponImages[ii].path = path;
					weaponImages[ii].src = path;
				}
			}
			for (const key of Object.keys(this.inventory.healings)) {
				document.getElementById("healing-count-" + Healing.mapping.indexOf(key))!.innerHTML = `${this.inventory.healings[key]}`;
				if (this.inventory.healings[key]) document.getElementById("healing-panel-" + Healing.mapping.indexOf(key))!.classList.add("enabled");
				else document.getElementById("healing-panel-" + Healing.mapping.indexOf(key))!.classList.remove("enabled");
			}
		} else this.inventory = new PartialInventory(<MinInventory>minEntity.inventory);
		if (this.despawn) this.zIndex = 7;
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		this.currentSkinSVG.onload = () => this.currentSkinSVG.loaded = true;
		this.currentSkinSVG.src = "assets/images/game/skins/" + this.skin + ".svg";
		const relative = this.position.addVec(you.position.inverse());
		const radius = scale * this.hitbox.comparable;
		console.log("drawimage currentSkinSVG")
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		if (!this.despawn) {
			ctx.rotate(this.direction.angle());

			if (this.inventory.backpackLevel) {
				ctx.fillStyle = "#675230";
				ctx.lineWidth = radius / 6;
				ctx.strokeStyle = "#000000";
				circleFromCenter(ctx, -radius * 0.2 * (1 + this.inventory.backpackLevel), 0, radius * 0.9, true, true);
			}
			ctx.drawImage(this.currentSkinSVG, -radius, -radius, radius * 2 , radius * 2 );

			// We will leave the transform for the weapon
			// If player is holding nothing, render fist
			var weapon = WEAPON_SUPPLIERS.get("fists")!.create();
			if (typeof this.inventory.holding === "number") weapon = (<Inventory>this.inventory).getWeapon()!;
			else weapon = (<PartialInventory>this.inventory).holding;
			weapon.render(this, canvas, ctx, scale);
			ctx.resetTransform();
		} else {
			ctx.drawImage(deathImg, -radius * 2, -radius * 2, radius * 4, radius * 4);
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			ctx.font = `700 ${scale}px Jura`;
			ctx.fillStyle = "#60605f";
			ctx.fillText(this.username, 2, radius * 2 + 2);
			ctx.fillStyle = "#80807f"
			ctx.fillText(this.username, 0, radius * 2);
			ctx.resetTransform();
		}
	}
}

export class PartialPlayer extends Player {
	inventory!: PartialInventory;

	static {
		ENTITY_SUPPLIERS.set(Player.TYPE, new PlayerSupplier());
	}
}

export class FullPlayer extends Player {
	inventory!: Inventory;
	boost!: number;
	maxBoost!: number;
	scope!: number;
	canInteract?: boolean;
	reloadTicks!: number;
	maxReloadTicks!: number;
	healTicks!: number;
	maxHealTicks!: number;

	copy(minEntity: MinEntity & AdditionalEntity) {
		super.copy(minEntity);
		this.health = minEntity.health;
		this.maxHealth = minEntity.maxHealth;
		this.boost = minEntity.boost;
		this.maxBoost = minEntity.maxBoost;
		this.scope = minEntity.scope;
		this.canInteract = minEntity.canInteract || false;
		this.reloadTicks = minEntity.reloadTicks;
		this.maxReloadTicks = minEntity.maxReloadTicks;
		this.healTicks = minEntity.healTicks;
		this.maxHealTicks = minEntity.maxHealTicks;
	}
}