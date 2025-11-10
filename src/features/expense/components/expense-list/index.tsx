"use client";

import { ExpenseListProvider } from "./expense-list-provider.internal";
import { ExpenseListWidget } from "./expense-list-widget.internal";

function ExpenseList() {
	return (
		<ExpenseListProvider>
			<ExpenseListWidget />
		</ExpenseListProvider>
	);
}

export { ExpenseList };
