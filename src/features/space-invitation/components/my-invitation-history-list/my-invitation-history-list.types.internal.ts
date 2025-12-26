import type { Prisma } from "@prisma/client";
import type { WithApi } from "@/lib/utils/types";

type CustomSpaceInvitation = WithApi<
	Prisma.SpaceInvitationGetPayload<{
		include: {
			space: true;
			createdBy: true;
		};
	}>
>;

export type { CustomSpaceInvitation };
