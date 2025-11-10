"use client";

import { useEffect } from "react";
import type { Breadcrumb } from "@/components/ui/breadcrumb/breadcrumb.types";
import { useBreadcrumb } from "./use-breadcrumb";

function PageCrumb({ crumb }: { crumb: Breadcrumb }) {
	const { addCrumb, removeCrumb } = useBreadcrumb();

	useEffect(() => {
		addCrumb(crumb);

		return () => removeCrumb();
	}, [crumb, addCrumb, removeCrumb]);

	return null;
}

export { PageCrumb };
