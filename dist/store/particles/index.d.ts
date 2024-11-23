import { MinParticle } from "../../types/minimized";
import { ParticleSupplier } from "../../types/supplier";
export declare const PARTICLE_SUPPLIERS: Map<string, ParticleSupplier>;
export { default as Wood } from "./wood";
export { default as Ripple } from "./ripple";
export declare function castParticle(minParticle: MinParticle): import("../../types/particle").Particle;
