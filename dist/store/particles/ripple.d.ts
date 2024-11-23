import { MinParticle } from "../../types/minimized";
import { GrowFadeParticle } from "../../types/particle";
export default class Ripple extends GrowFadeParticle {
    static readonly ID = "ripple";
    id: string;
    zIndex: number;
    constructor(minParticle: MinParticle);
}
