"use client";

import { useCallback, useMemo, useState } from "react";
import type { Breadcrumb } from "@/components/ui/breadcrumb/breadcrumb.types";
import {
	BreadcrumbContext,
	type BreadcrumbContextType,
} from "./breadcrumb-context";

function BreadcrumbProvider({
	children,
	initialState,
}: React.PropsWithChildren & { initialState?: Breadcrumb[] }) {
	const [crumbs, setCrumbs] = useState<Breadcrumb[]>(() => initialState ?? []);

	const handleCrumbAdd = useCallback((crumb: Breadcrumb) => {
		setCrumbs((previous) => [...previous, crumb]);
	}, []);

	const handleCrumbRemove = useCallback(() => {
		setCrumbs((previous) => [...previous.slice(0, previous.length - 1)]);
	}, []);

	const ctxValue = useMemo<BreadcrumbContextType>(
		() => ({
			crumbs,
			addCrumb: handleCrumbAdd,
			removeCrumb: handleCrumbRemove,
		}),
		[crumbs, handleCrumbAdd, handleCrumbRemove]
	);

	return <BreadcrumbContext value={ctxValue}>{children}</BreadcrumbContext>;
}

export { BreadcrumbProvider };
