"use client";

import { useContext } from "react";
import {
	DirectionContext,
	type DirectionContextType,
} from "../contexts/direction-context";

function useDirection(): DirectionContextType {
	const context = useContext(DirectionContext);

	if (!context) {
		throw new Error("useDirection must be used within a DirectionProvider.");
	}

	return context;
}

export { useDirection };
