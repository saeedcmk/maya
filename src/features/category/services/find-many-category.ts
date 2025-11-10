import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { CategoryFindManyArgs } from "../models/category-find-many";

async function findManyCategory<
	T extends CategoryFindManyArgs,
	R = WithApi<Prisma.CategoryGetPayload<T>>,
>(spaceId: string, args: T): Promise<R[]> {
	const { data } = await apiClient
		.get(`space/${spaceId}/category`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R[]>>();

	return data;
}

export { findManyCategory };
