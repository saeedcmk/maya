import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type Space = WithOptional<
	WithApi<
		Prisma.SpaceGetPayload<{
			include: { [key in keyof Prisma.SpaceInclude]: true };
		}>
	>,
	keyof Prisma.SpaceInclude
>;

export type { Space };
