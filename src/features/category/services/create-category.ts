import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { CategoryCreateInput } from "../models/category-create";
import type { Category } from "../types/category";

async function createCategory(
	spaceId: string,
	input: CategoryCreateInput
): Promise<Category> {
	const { data } = await apiClient
		.post(`space/${spaceId}/category`, {
			json: input,
		})
		.json<ApiSuccessResponse<Category>>();

	return data;
}

export { createCategory };
