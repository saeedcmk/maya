import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceInvitationCountArgs } from "../models/space-invitation-count";

async function countMyInvitation<T extends SpaceInvitationCountArgs>(
	args: T
): Promise<number> {
	const { data } = await apiClient
		.get("invitation/count", {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<number>>();

	return data;
}

export { countMyInvitation };
