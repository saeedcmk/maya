import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type Feature = WithOptional<
	WithApi<
		Prisma.FeatureGetPayload<{
			include: { [key in keyof Prisma.FeatureInclude]: true };
		}>
	>,
	keyof Prisma.FeatureInclude
>;

export type { Feature };
