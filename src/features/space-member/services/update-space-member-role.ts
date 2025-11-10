import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceMemberRoleUpdateInput } from "../models/space-member-role-update";

async function updateSpaceMemberRole(
	memberId: string,
	spaceId: string,
	input: SpaceMemberRoleUpdateInput
): Promise<boolean> {
	await apiClient
		.patch(`space/${spaceId}/member/${memberId}`, {
			json: input,
		})
		.json<ApiSuccessResponse>();

	return true;
}

export { updateSpaceMemberRole };
