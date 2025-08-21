import { TERRAIN_SUPPLIERS } from ".";
import { MinTerrain, MinLine, MinVec2 } from "../../types/minimized";
import { TerrainSupplier } from "../../types/supplier";
import { LineTerrain } from "../../types/terrain";

class SlDarkBeachSupplier implements TerrainSupplier {
	create(minTerrain: MinTerrain & { line: MinLine, range: number, boundary: MinVec2[] }) {
		return new SlDarkBeach(minTerrain);
	}
}

export default class SlDarkBeach extends LineTerrain {
	static readonly ID = "sldarkbeach";
	id = SlDarkBeach.ID;
	color = 0xbb8328;

	static {
		TERRAIN_SUPPLIERS.set(SlDarkBeach.ID, new SlDarkBeachSupplier());
	}
}