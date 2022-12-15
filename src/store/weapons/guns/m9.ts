import { GunWeapon } from "../../../types/weapons";
import { GunColor } from "../../entities/gun";

export default class M9 extends GunWeapon {
	id = "m9";
	name = "M9";
	continuous = false;
	ammo = GunColor.YELLOW;
	speed = 0.2;
	accuracy = 0.5;
	inaccuracy = 0.1;
	weight = 0.9;
	ticks = 50;
	delay = 12;
	recoil = 0.1;
}