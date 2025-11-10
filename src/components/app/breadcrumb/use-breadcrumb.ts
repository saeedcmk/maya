"use client";

import { useContext } from "react";
import {
	BreadcrumbContext,
	type BreadcrumbContextType,
} from "./breadcrumb-context";

function useBreadcrumb(): BreadcrumbContextType {
	const context = useContext(BreadcrumbContext);

	if (!context) {
		throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
	}

	return context;
}

export { useBreadcrumb };
