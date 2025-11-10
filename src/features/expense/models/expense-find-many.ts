import type { Prisma } from "@prisma/client";

type ExpenseFindManyArgs = Prisma.ExpenseFindManyArgs &
	Partial<{ count: boolean }>;

export type { ExpenseFindManyArgs };
