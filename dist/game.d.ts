import { FullPlayer } from "./store/entities";
import { World } from "./types/world";
export declare var world: World;
export declare function getId(): string | null;
export declare function getPlayer(): FullPlayer | null;
export declare function getTPS(): number;
