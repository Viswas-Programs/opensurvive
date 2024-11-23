import { MinParticle } from "../../types/minimized";
import { TextureFadeParticle } from "../../types/particle";
export default class Wood extends TextureFadeParticle {
    static readonly ID = "wood";
    id: string;
    texture: string;
    constructor(minParticle: MinParticle);
}
