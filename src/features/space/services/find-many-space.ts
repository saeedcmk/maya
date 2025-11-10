import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { SpaceFindManyArgs } from "../models/space-find-many";

async function findManySpace<
	T extends SpaceFindManyArgs,
	R = WithApi<Prisma.SpaceGetPayload<T>>,
>(args: T): Promise<R[]> {
	const { data } = await apiClient
		.get("space", {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R[]>>();

	return data;
}

export { findManySpace };
