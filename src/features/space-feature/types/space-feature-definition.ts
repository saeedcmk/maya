import { FeatureDefinition } from "@/features/feature/types/feature-definition";

type SpaceFeatureDefinition = {
	max_space_members: FeatureDefinition<"NUMERIC">;
	export_csv: FeatureDefinition<"BOOLEAN">;
};

export type { SpaceFeatureDefinition };
