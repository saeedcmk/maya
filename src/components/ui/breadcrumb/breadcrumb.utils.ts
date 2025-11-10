import { type Route } from "@/lib/routes";
import { type Breadcrumb } from "./breadcrumb.types";

function toCrumb<T extends object>(
	route: Route<T>,
	params?: T extends object ? T : undefined
): Breadcrumb<T> {
	return {
		key: route.key,
		url: route.url(params!),
		params,
	};
}

export { toCrumb };
