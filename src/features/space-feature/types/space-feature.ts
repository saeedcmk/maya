import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type SpaceFeature = WithOptional<
	WithApi<
		Prisma.SpaceFeatureGetPayload<{
			include: { [key in keyof Prisma.SpaceFeatureInclude]: true };
		}>
	>,
	keyof Prisma.SpaceFeatureInclude
>;

export type { SpaceFeature };
