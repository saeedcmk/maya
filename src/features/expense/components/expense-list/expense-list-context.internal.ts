"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListWithPaginationContextType } from "@/lib/utils/types";
import type {
	CustomExpense,
	ExpenseListFilterArgs,
} from "./expense-list.types.internal";

type ExpenseListContextType =
	EntityListWithPaginationContextType<CustomExpense> & {
		period: { year: number; month: number };
		changePeriod: (input: { year: number; month: number }) => void;

		filterArgs: ExpenseListFilterArgs;
		setFilterArgs: (filterArgs: ExpenseListFilterArgs) => void;

		openFilterDialog: () => Promise<void>;
		openReportDialog: () => Promise<void>;

		openUpsertDialog: (expense?: CustomExpense) => Promise<void>;
		openDeleteDialog: (expense: CustomExpense) => Promise<void>;

		exportManyOp: UseMutationResult<Blob, Error, void>;
	};

const ExpenseListContext = createContext<ExpenseListContextType | null>(null);

function useExpenseListContext(): ExpenseListContextType {
	return useContextCreator(ExpenseListContext);
}

export type { ExpenseListContextType };
export { ExpenseListContext, useExpenseListContext };
