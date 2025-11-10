import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type SpaceMember = WithOptional<
	WithApi<
		Prisma.SpaceMemberGetPayload<{
			include: { [key in keyof Prisma.SpaceMemberInclude]: true };
		}>
	>,
	keyof Prisma.SpaceMemberInclude
>;

export type { SpaceMember };
