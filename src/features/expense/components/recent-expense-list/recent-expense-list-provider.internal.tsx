"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import type { ExpenseFindManyArgs } from "../../models/expense-find-many";
import { findManyExpense } from "../../services/find-many-expense";
import {
	RecentExpenseListContext,
	type RecentExpenseListContextType,
} from "./recent-expense-list-context.internal";

const ExpenseCreateDialog = dynamic(() => import("../expense-upsert"));

const queryArgs = {
	include: { createdBy: true, category: true },
	orderBy: [{ createdAt: "desc" }, { amount: "desc" }],
	take: 3,
} satisfies ExpenseFindManyArgs;

function RecentExpenseListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const messages = useMessages();

	const { space } = useSpaceContext();

	const {
		data: expenses,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["spaces", space.id, "expenses", queryArgs],
		queryFn: async () => await findManyExpense(space.id, queryArgs),
		placeholderData: keepPreviousData,
	});

	const openCreateDialog = useCallback(async () => {
		await dialogs.open(ExpenseCreateDialog, { space }, { messages });
	}, [dialogs, messages, space]);

	const contextValue = useMemo<RecentExpenseListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: expenses,

			openCreateDialog,
		}),
		[isFetching, error, expenses, openCreateDialog]
	);

	return <RecentExpenseListContext value={contextValue} {...props} />;
}

export { RecentExpenseListProvider };
