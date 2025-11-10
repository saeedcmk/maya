import { apiClient } from "@/lib/data/api/api-client";

async function deleteCategory(
	categoryId: string,
	spaceId: string,
	fallbackId?: string
): Promise<void> {
	const data = fallbackId ? { fallbackId } : undefined;

	await apiClient.delete(`space/${spaceId}/category/${categoryId}`, {
		json: data ?? {},
	});
}

export { deleteCategory };
