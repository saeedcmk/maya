import type { ObjectProperty } from "./object.types";

function getObjectDefinedValuesCount(obj: object): number {
	return Object.values(obj).filter((x) => typeof x !== "undefined").length;
}

function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

function getObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}

function getObjectNestedValue(
	obj: Record<string, any>,
	keys: string | string[]
): any | undefined {
	const keysArr = Array.isArray(keys) ? keys : keys.split(".");

	return keysArr.reduce((acc, key) => {
		return acc && acc[key] !== undefined ? acc[key] : undefined;
	}, obj);
}

function getObjectProperty<T extends Record<string, any>>(
	obj: T,
	property: ObjectProperty<T>
): string {
	if (typeof property === "function") return property(obj);

	return obj[property].toString();
}

function omitUndefinedProperties<T extends Record<string, any>>(
	obj: T
): Partial<T> {
	Object.keys(obj).forEach((key) =>
		typeof obj[key] === "undefined" ? delete obj[key] : {}
	);

	return obj;
}

export {
	getObjectDefinedValuesCount,
	getObjectEntries,
	getObjectKeys,
	getObjectNestedValue,
	getObjectProperty,
	omitUndefinedProperties,
};
