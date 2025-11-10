import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { SpaceFindUniqueArgs } from "../models/space-find-unique";

async function findUniqueSpace<
	T extends SpaceFindUniqueArgs,
	R = WithApi<Prisma.SpaceGetPayload<T>>,
>(args: T): Promise<R> {
	const { data } = await apiClient
		.get(`space/${args.where.id}`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R>>();

	return data;
}

export { findUniqueSpace };
