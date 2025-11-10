import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { ExpenseUpdateInput } from "../models/expense-update";
import type { Expense } from "../types/expense";

async function updateExpense(
	expenseId: string,
	spaceId: string,
	input: ExpenseUpdateInput
): Promise<Expense> {
	const { data } = await apiClient
		.patch(`space/${spaceId}/expense/${expenseId}`, {
			json: input,
		})
		.json<ApiSuccessResponse<Expense>>();

	return data;
}

export { updateExpense };
