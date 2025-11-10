import { createContext } from "react";
import type { Breadcrumb } from "@/components/ui/breadcrumb/breadcrumb.types";

type BreadcrumbContextType = {
	crumbs: Breadcrumb[];
	addCrumb: (crumb: Breadcrumb) => void;
	removeCrumb: () => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export type { BreadcrumbContextType };
export { BreadcrumbContext };
