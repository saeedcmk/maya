import type { Expense, Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import { WithApi } from "@/lib/utils/types";
import type { ExpenseAggregateArgs } from "../models/expense-aggregate";

async function aggregateExpense<
	T extends ExpenseAggregateArgs,
	R = WithApi<Prisma.Result<Expense, T, "aggregate">>,
>(spaceId: string, args: T): Promise<R> {
	const { data } = await apiClient
		.get(`space/${spaceId}/expense/aggregate`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R>>();

	return data;
}

export { aggregateExpense };
