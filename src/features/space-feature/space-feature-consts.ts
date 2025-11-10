import { FeatureScope } from "../feature/enums/feature-scope";
import { FeatureType } from "../feature/enums/feature-type";
import { SpaceFeatureDefinition } from "./types/space-feature-definition";

const SPACE_FEATURE_DEFINITIONS: SpaceFeatureDefinition = {
	max_space_members: {
		key: "max_space_members",
		scope: FeatureScope.SPACE,
		type: FeatureType.NUMERIC,
		defaultValue: 2,
	},

	export_csv: {
		key: "export_csv",
		scope: FeatureScope.SPACE,
		type: FeatureType.BOOLEAN,
		defaultValue: true,
	},
};

export { SPACE_FEATURE_DEFINITIONS };
