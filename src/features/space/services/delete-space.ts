import { apiClient } from "@/lib/data/api/api-client";

async function deleteSpace(id: string): Promise<void> {
	await apiClient.delete(`space/${id}`);
}

export { deleteSpace };
