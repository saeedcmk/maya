import { apiClient } from "@/lib/data/api/api-client";

async function deleteExpense(
	expenseId: string,
	spaceId: string
): Promise<void> {
	await apiClient.delete(`space/${spaceId}/expense/${expenseId}`);
}

export { deleteExpense };
