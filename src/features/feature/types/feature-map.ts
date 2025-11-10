import { FeatureType } from "../enums/feature-type";
import { FeatureDefinition } from "./feature-definition";

type FeatureMap<T extends Record<string, FeatureDefinition<FeatureType>>> = {
	[K in keyof T]: T[K]["defaultValue"];
};

export type { FeatureMap };
