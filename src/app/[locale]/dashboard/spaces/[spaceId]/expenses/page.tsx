import { ExpenseList } from "@/features/expense/components/expense-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function ExpensesPage() {
	const messages = await getPartialMessages([
		"features.expense.components.expense-list",
		"features.expense.components.expense-month-report",
		"features.expense.components.expense-upsert",
	]);

	return (
		<I18nProvider messages={messages}>
			<ExpenseList />
		</I18nProvider>
	);
}

export default ExpensesPage;
