import { TERRAIN_SUPPLIERS } from ".";
import { MinTerrain, MinLine, MinVec2 } from "../../types/minimized";
import { TerrainSupplier } from "../../types/supplier";
import { LineTerrain } from "../../types/terrain";

class DarkBeachSupplier implements TerrainSupplier {
	create(minTerrain: MinTerrain & { line: MinLine, range: number, boundary: MinVec2[] }) {
		return new DarkBeach(minTerrain);
	}
}

export default class DarkBeach extends LineTerrain {
	static readonly ID = "darkbeach";
	id = DarkBeach.ID;
	color = 0x775124;

	static {
		TERRAIN_SUPPLIERS.set(DarkBeach.ID, new DarkBeachSupplier());
	}
}