import { apiClient } from "@/lib/data/api/api-client";

async function logout(): Promise<void> {
	await apiClient.get("auth/logout");
}

export { logout };
