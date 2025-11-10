import { apiClient } from "@/lib/data/api/api-client";

async function deleteSpaceInvitation(
	invitationId: string,
	spaceId: string
): Promise<void> {
	await apiClient.delete(`space/${spaceId}/invitation/${invitationId}`);
}

export { deleteSpaceInvitation };
