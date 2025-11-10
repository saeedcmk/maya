import { apiClient } from "@/lib/data/api/api-client";

async function removeMemberFromSpace(
	spaceId: string,
	memberId: string
): Promise<boolean> {
	await apiClient.delete(`space/${spaceId}/member/${memberId}`);

	return true;
}

export { removeMemberFromSpace };
