import { LineTerrain } from "../../types/terrain";
export default class Beach extends LineTerrain {
    static readonly ID = "beach";
    id: string;
    color: number;
}
