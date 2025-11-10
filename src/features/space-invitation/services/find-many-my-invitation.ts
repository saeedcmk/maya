import type { Prisma } from "@prisma/client";
import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { WithApi } from "@/lib/utils/types";
import type { SpaceInvitationFindManyArgs } from "../models/space-invitation-find-many";

async function findManyMyInvitation<
	T extends SpaceInvitationFindManyArgs,
	R = WithApi<Prisma.SpaceInvitationGetPayload<T>>,
>(args: T): Promise<R[]> {
	const { data } = await apiClient
		.get("invitation", {
			searchParams: new URLSearchParams({ query: JSON.stringify(args) }),
		})
		.json<ApiSuccessResponse<R[]>>();

	return data;
}

export { findManyMyInvitation };
