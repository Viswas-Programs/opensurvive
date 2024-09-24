import { PARTICLE_SUPPLIERS } from ".";
import { MinParticle } from "../../types/minimized";
import { TextureFadeParticle } from "../../types/particle";
import { ParticleSupplier } from "../../types/supplier";

type AdditionalParticle = {
	duration: number;
}

class Case_SmallSupplier implements ParticleSupplier {
	create(minParticle: MinParticle & AdditionalParticle) {
		return new Case_Small(minParticle);
	}
}

export default class Case_Small extends TextureFadeParticle {
	static readonly ID = "case_small";
	id = Case_Small.ID;
	texture = "case_small";

	constructor(minParticle: MinParticle) {
		super(Object.assign(minParticle, { duration: 1500, fadeStart: 700 }));
	}

	static {
		PARTICLE_SUPPLIERS.set(Case_Small.ID, new Case_SmallSupplier());
	}
}