"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomExpense } from "./recent-expense-list.types.internal";

type RecentExpenseListContextType = EntityListContextType<CustomExpense> & {
	openCreateDialog: (expense?: CustomExpense) => Promise<void>;
};

const RecentExpenseListContext =
	createContext<RecentExpenseListContextType | null>(null);

function useRecentExpenseListContext(): RecentExpenseListContextType {
	return useContextCreator(RecentExpenseListContext);
}

export type { RecentExpenseListContextType };
export { RecentExpenseListContext, useRecentExpenseListContext };
