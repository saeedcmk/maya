import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { SpaceFeatureFindManyArgs } from "../models/space-feature-find-many";

async function findManySpaceFeature<
	T extends SpaceFeatureFindManyArgs,
	R = WithApi<Prisma.SpaceFeatureGetPayload<T>>,
>(spaceId: string, args: T): Promise<R[]> {
	const { data } = await apiClient
		.get(`space/${spaceId}/feature`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R[]>>();

	return data;
}

export { findManySpaceFeature };
