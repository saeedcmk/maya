import type { Prisma } from "@prisma/client";
import type { WithOptional } from "@/lib/utils/types";

type User = WithOptional<
	Prisma.UserGetPayload<{
		include: { [key in keyof Prisma.UserInclude]: true };
	}>,
	keyof Prisma.UserInclude
>;

export type { User };
