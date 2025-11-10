"use client";

import { useContext } from "react";
import { SpaceContext, type SpaceContextType } from "../contexts/space-context";

function useSpaceContext(): SpaceContextType {
	const context = useContext(SpaceContext);

	if (!context) {
		throw new Error("useSpaceContext must be used within a SpaceProvider");
	}

	return context;
}

export { useSpaceContext };
