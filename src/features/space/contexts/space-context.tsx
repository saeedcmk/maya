"use client";

import type { Prisma } from "@prisma/client";
import { createContext } from "react";
import type { SpaceFeatureMap } from "@/features/space-feature/types/space-feature-map";
import type { WithApi } from "@/lib/utils/types";

type SpaceContextCustomSpace = WithApi<
	Prisma.SpaceGetPayload<{
		include: { owner: true; members: { include: { user: true } } };
	}>
>;

type SpaceContextType = {
	space: SpaceContextCustomSpace;
	features: SpaceFeatureMap;
	isOwnerOrAdmin: boolean;

	isLoading: boolean;
};

const SpaceContext = createContext<SpaceContextType | null>(null);

export type { SpaceContextCustomSpace, SpaceContextType };
export { SpaceContext };
