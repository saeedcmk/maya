import type { Prisma } from "@prisma/client";
import type { WithApi } from "@/lib/utils/types";

type CustomExpense = WithApi<
	Prisma.ExpenseGetPayload<{
		include: { createdBy: true; category: true };
	}>
>;

export type { CustomExpense };
