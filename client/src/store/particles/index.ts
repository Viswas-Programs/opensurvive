import { MinParticle } from "../../types/minimized";
import { DummyParticle } from "../../types/particle";
import { ParticleSupplier } from "../../types/supplier";

export const PARTICLE_SUPPLIERS = new Map<string, ParticleSupplier>();

export { default as Wood } from "./wood";
export { default as Ripple } from "./ripple";
export { default as Case_Small } from "./case_small";
export { default as Case_Med } from "./case_med";
export { default as Case_Large } from "./case_large";
export { default as Case_12ga } from "./case_12ga";

export function castParticle(minParticle: MinParticle) {
	return PARTICLE_SUPPLIERS.get(minParticle.id)?.create(minParticle) || new DummyParticle(minParticle);
}