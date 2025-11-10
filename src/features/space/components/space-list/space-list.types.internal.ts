import type { Prisma } from "@prisma/client";
import type { WithApi } from "@/lib/utils/types";

type CustomSpace = WithApi<
	Prisma.SpaceGetPayload<{
		include: {
			owner: true;
		};
	}>
>;

export type { CustomSpace };
