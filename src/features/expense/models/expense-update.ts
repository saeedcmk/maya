type ExpenseUpdateInput = Partial<{
	title: string;
	amount: string | number;
	date: string;
	categoryId: string;
}>;

export type { ExpenseUpdateInput };
