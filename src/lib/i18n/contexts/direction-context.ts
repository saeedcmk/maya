"use client";

import { createContext } from "react";
import type { Direction } from "../types/direction";
import type { DirectionSide } from "../types/direction-side";

type DirectionContextType = {
	dir: Direction;
	side: DirectionSide;
};

const DirectionContext = createContext<DirectionContextType | null>(null);

export type { DirectionContextType };
export { DirectionContext };
