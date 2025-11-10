import { FeatureType, type FeatureTypeValueMap } from "../enums/feature-type";

function parseFeatureValue<T extends FeatureType>(
	type: T,
	raw: string
): FeatureTypeValueMap[T] {
	switch (type) {
		case FeatureType.BOOLEAN:
			return (raw === "true") as FeatureTypeValueMap[T];
		case FeatureType.NUMERIC:
			return Number(raw) as FeatureTypeValueMap[T];
		default:
			return raw as FeatureTypeValueMap[T];
	}
}

export { parseFeatureValue };
