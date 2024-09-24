import { PARTICLE_SUPPLIERS } from ".";
import { MinParticle } from "../../types/minimized";
import { TextureFadeParticle } from "../../types/particle";
import { ParticleSupplier } from "../../types/supplier";

type AdditionalParticle = {
	duration: number;
}

class Case_LargeSupplier implements ParticleSupplier {
	create(minParticle: MinParticle & AdditionalParticle) {
		return new Case_Large(minParticle);
	}
}

export default class Case_Large extends TextureFadeParticle {
	static readonly ID = "case_large";
	id = Case_Large.ID;
	texture = "case_large";

	constructor(minParticle: MinParticle) {
		super(Object.assign(minParticle, { duration: 2000, fadeStart: 2000 }));
	}

	static {
		PARTICLE_SUPPLIERS.set(Case_Large.ID, new Case_LargeSupplier());
	}
}