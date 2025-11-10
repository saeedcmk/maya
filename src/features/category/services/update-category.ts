import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { CategoryUpdateInput } from "../models/category-update";
import type { Category } from "../types/category";

async function updateCategory(
	categoryId: string,
	spaceId: string,
	input: CategoryUpdateInput
): Promise<Category> {
	const { data } = await apiClient
		.patch(`space/${spaceId}/category/${categoryId}`, {
			json: input,
		})
		.json<ApiSuccessResponse<Category>>();

	return data;
}

export { updateCategory };
