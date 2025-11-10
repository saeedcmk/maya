import type { Feature } from "@/features/feature/types/feature";
import { parseFeatureValue } from "@/features/feature/utils/parse-feature-value";
import { SPACE_FEATURE_DEFINITIONS } from "../space-feature-consts";
import type { SpaceFeatureDefinition } from "../types/space-feature-definition";
import type { SpaceFeatureMap } from "../types/space-feature-map";

function resolveSpaceFeatureMap(
	features: Pick<Feature, "key" | "type" | "value">[]
): SpaceFeatureMap {
	const result: Record<string, any> = {};

	for (const k in SPACE_FEATURE_DEFINITIONS) {
		const key = k as keyof SpaceFeatureDefinition;

		const feature = features.find((x) => x.key === key);

		if (feature) {
			result[key] = parseFeatureValue(feature.type, feature.value);
		} else {
			result[key] = SPACE_FEATURE_DEFINITIONS[key].defaultValue;
		}
	}

	return result as SpaceFeatureMap;
}

export { resolveSpaceFeatureMap };
