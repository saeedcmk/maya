import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { ExpenseCreateInput } from "../models/expense-create";
import type { Expense } from "../types/expense";

async function createExpense(
	spaceId: string,
	input: ExpenseCreateInput
): Promise<Expense> {
	const { data } = await apiClient
		.post(`space/${spaceId}/expense`, {
			json: input,
		})
		.json<ApiSuccessResponse<Expense>>();

	return data;
}

export { createExpense };
