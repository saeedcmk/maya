import type { Prisma } from "@prisma/client";
import type { WithApi } from "@/lib/utils/types";

type CustomExpense = WithApi<
	Prisma.ExpenseGetPayload<{
		include: { createdBy: true; category: true };
	}>
>;

type ExpenseListFilterArgs = Partial<{
	title: string;
	categoryId: string;
}>;

export type { CustomExpense, ExpenseListFilterArgs };
