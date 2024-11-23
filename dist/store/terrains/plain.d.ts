import { MinTerrain } from "../../types/minimized";
import { FullTerrain } from "../../types/terrain";
export default class Plain extends FullTerrain {
    static readonly ID = "plain";
    id: string;
    color: number;
    constructor(minTerrain: MinTerrain);
}
