import { RecentExpenseList } from "@/features/expense/components/recent-expense-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { usePartialMessages } from "@/lib/i18n/hooks/use-partial-messages";

const SpacePage = () => {
	const messages = usePartialMessages([
		"features.expense.components.recent-expense-list",
		"features.expense.components.expense-upsert",
	]);

	return (
		<I18nProvider messages={messages}>
			<RecentExpenseList />
		</I18nProvider>
	);
};

export default SpacePage;
