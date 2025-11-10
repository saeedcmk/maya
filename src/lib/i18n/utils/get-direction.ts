import { getLangDir } from "rtl-detect";
import type { DirectionContextType } from "../contexts/direction-context";
import type { DirectionSide } from "../types/direction-side";

function getDirection(locale: string): DirectionContextType {
	const dir = getLangDir(locale);
	const side: DirectionSide = dir === "ltr" ? "left" : "right";

	return { dir, side };
}

export { getDirection };
