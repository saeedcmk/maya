import type { AbstractIntlMessages } from "next-intl";
import { getObjectNestedValue } from "@/lib/utils/object";

function getMessagesFromPath(
	messages: AbstractIntlMessages,
	path: string | (string | { path: string; spread: boolean })[]
) {
	return (Array.isArray(path) ? path : [path])
		.map((p) => {
			const pathStr = typeof p === "object" ? p.path : p;
			const spread = typeof p === "object" ? p.spread : false;

			const m = getObjectNestedValue(messages, pathStr);

			if (spread) {
				return { ...m };
			}

			const k = (typeof p === "object" ? p.path : p).split(".").at(-1)!;
			return { [k]: m };
		})
		.reduce((acc, curr) => {
			return { ...acc, ...curr };
		}, {});
}

export { getMessagesFromPath };
