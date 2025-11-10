"use client";

import { useContext } from "react";
import { DateContext, type DateContextType } from "../contexts/date-context";

function useDateUtils(): DateContextType {
	const context = useContext(DateContext);

	if (!context) {
		throw new Error("useDateUtils must be used within a DateProvider.");
	}

	return context;
}

export { useDateUtils };
