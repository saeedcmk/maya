import { apiClient } from "@/lib/data/api/api-client";
import { ExpenseExportArgs } from "../models/expense-export";

async function exportExpense<T extends ExpenseExportArgs>(
	spaceId: string,
	args: T
): Promise<Blob> {
	const blob = await apiClient
		.get(`space/${spaceId}/expense/export`, {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.blob();

	return blob;
}

export { exportExpense };
