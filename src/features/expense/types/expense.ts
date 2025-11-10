import type { Prisma } from "@prisma/client";
import type { WithApi, WithOptional } from "@/lib/utils/types";

type Expense = WithOptional<
	WithApi<
		Prisma.ExpenseGetPayload<{
			include: { [key in keyof Prisma.ExpenseInclude]: true };
		}>
	>,
	keyof Prisma.ExpenseInclude
>;

export type { Expense };
