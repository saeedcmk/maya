import type { Category } from "@/features/category/types/category";
import type { Expense } from "@/features/expense/types/expense";

type SpaceImportInput = {
	categories: Category[];
	expenses: Expense[];
};

export type { SpaceImportInput };
