import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type Category = WithOptional<
	WithApi<
		Prisma.CategoryGetPayload<{
			include: { [key in keyof Prisma.CategoryInclude]: true };
		}>
	>,
	keyof Prisma.CategoryInclude
>;

export type { Category };
