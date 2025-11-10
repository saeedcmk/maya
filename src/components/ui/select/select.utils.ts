import { getObjectEntries, getObjectProperty } from "@/lib/utils/object";
import type { ObjectProperty } from "@/lib/utils/object.types";
import type { SelectOptionGroup, SelectOptionItem } from "./select.types";

function toSelectOptions<T extends Record<string, any>>(
	data: T[],
	options: { item: { value: ObjectProperty<T>; label?: ObjectProperty<T> } }
): SelectOptionItem[];

function toSelectOptions<T extends Record<string, any>>(
	data: Record<string, T[]>,
	options: {
		item: { value: ObjectProperty<T>; label?: ObjectProperty<T> };
		group: { label: (key: string) => string };
	}
): SelectOptionGroup[];

function toSelectOptions<T extends Record<string, any>>(
	data: Record<string, T[]> | T[],
	options: {
		item: { value: ObjectProperty<T>; label?: ObjectProperty<T> };
		group?: { label: (key: string) => string };
	}
): SelectOptionGroup[] | SelectOptionItem[] {
	if (!Array.isArray(data)) {
		return getObjectEntries(data).map(([key, items]) => ({
			label: options.group!.label(key),
			options: toSelectOptions(items, { ...options }),
		}));
	}

	return data.map((item) => ({
		value: getObjectProperty(item, options.item.value),
		label: options.item.label
			? getObjectProperty(item, options.item.label)
			: undefined,
	}));
}

export { toSelectOptions };
