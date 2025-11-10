import { FeatureType as PrismaFeatureType } from "@prisma/client";

const FeatureType = PrismaFeatureType;

type FeatureType = PrismaFeatureType;

type FeatureTypeValueMap = {
	[FeatureType.BOOLEAN]: boolean;
	[FeatureType.NUMERIC]: number;
	[FeatureType.TEXT]: string;
};

export type { FeatureTypeValueMap };
export { FeatureType };
