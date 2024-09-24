import { PARTICLE_SUPPLIERS } from ".";
import { MinParticle } from "../../types/minimized";
import { TextureFadeParticle } from "../../types/particle";
import { ParticleSupplier } from "../../types/supplier";

type AdditionalParticle = {
	duration: number;
}

class Case_12gaSupplier implements ParticleSupplier {
	create(minParticle: MinParticle & AdditionalParticle) {
		return new Case_12ga(minParticle);
	}
}

export default class Case_12ga extends TextureFadeParticle {
	static readonly ID = "case_12ga";
	id = Case_12ga.ID;
	texture = "case_12ga";

	constructor(minParticle: MinParticle) {
		super(Object.assign(minParticle, { duration: 2000, fadeStart: 2000 }));
	}

	static {
		PARTICLE_SUPPLIERS.set(Case_12ga.ID, new Case_12gaSupplier());
	}
}