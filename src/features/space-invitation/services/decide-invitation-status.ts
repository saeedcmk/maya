import { apiClient } from "@/lib/data/api/api-client";

async function decideInvitationStatus(
	invitationId: string,
	status: "ACCEPTED" | "DECLINED"
): Promise<void> {
	await apiClient.post(`invitation/${invitationId}`, {
		json: { status },
	});
}

export { decideInvitationStatus };
