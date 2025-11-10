import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { ExpenseFindManyArgs } from "../models/expense-find-many";

async function findManyExpense<
	T extends Omit<ExpenseFindManyArgs, "count">,
	R = WithApi<Prisma.ExpenseGetPayload<T>>,
>(spaceId: string, args: T): Promise<R[]> {
	const { data } = await apiClient
		.get(`space/${spaceId}/expense`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R[]>>();

	return data;
}

export { findManyExpense };
