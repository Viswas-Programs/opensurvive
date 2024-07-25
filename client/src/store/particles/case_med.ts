import { PARTICLE_SUPPLIERS } from ".";
import { MinParticle } from "../../types/minimized";
import { TextureFadeParticle } from "../../types/particle";
import { ParticleSupplier } from "../../types/supplier";

type AdditionalParticle = {
	duration: number;
}

class Case_MedSupplier implements ParticleSupplier {
	create(minParticle: MinParticle & AdditionalParticle) {
		return new Case_Med(minParticle);
	}
}

export default class Case_Med extends TextureFadeParticle {
	static readonly ID = "case_med";
	id = Case_Med.ID;
	texture = "case_med";

	constructor(minParticle: MinParticle) {
		super(Object.assign(minParticle, { duration: 2500, fadeStart: 2500 }));
	}

	static {
		PARTICLE_SUPPLIERS.set(Case_Med.ID, new Case_MedSupplier());
	}
}