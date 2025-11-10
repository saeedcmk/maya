"use client";

import { RecentExpenseListProvider } from "./recent-expense-list-provider.internal";
import { RecentExpenseListWidget } from "./recent-expense-list-widget.internal";

function RecentExpenseList() {
	return (
		<RecentExpenseListProvider>
			<RecentExpenseListWidget />
		</RecentExpenseListProvider>
	);
}

export { RecentExpenseList };
