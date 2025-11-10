import { FeatureScope } from "../enums/feature-scope";
import { FeatureType, type FeatureTypeValueMap } from "../enums/feature-type";

type FeatureDefinition<TType extends FeatureType> = {
	key: string;
	scope: FeatureScope;
	type: TType;
	defaultValue: FeatureTypeValueMap[TType];
};

export type { FeatureDefinition };
