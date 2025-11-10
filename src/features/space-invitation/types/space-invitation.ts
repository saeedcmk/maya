import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type SpaceInvitation = WithOptional<
	WithApi<
		Prisma.SpaceInvitationGetPayload<{
			include: { [key in keyof Prisma.SpaceInvitationInclude]: true };
		}>
	>,
	keyof Prisma.SpaceInvitationInclude
>;

export type { SpaceInvitation };
