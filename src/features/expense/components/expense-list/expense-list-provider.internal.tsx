"use client";

import { Prisma } from "@prisma/client";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { usePagination } from "@/components/ui/pagination/use-pagination";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { useDateUtils } from "@/lib/i18n/hooks/use-date-utils";
import { useLanguage } from "@/lib/i18n/hooks/use-language";
import type { ExpenseFindManyArgs } from "../../models/expense-find-many";
import { deleteExpense } from "../../services/delete-expense";
import { exportExpense } from "../../services/export-expense";
import { findManyAndCountExpense } from "../../services/find-many-and-count-expense";
import {
	type CustomExpense,
	ExpenseListFilterArgs,
} from "./expense-list.types.internal";
import {
	ExpenseListContext,
	type ExpenseListContextType,
} from "./expense-list-context.internal";

const ExpenseListFilterDialog = dynamic(
	() => import("./expense-list-filter-dialog.internal")
);

const ExpenseMonthReportDialog = dynamic(
	() => import("../expense-month-report")
);

const ExpenseUpsertDialog = dynamic(() => import("../expense-upsert"));

const ExpenseDeleteDialog = dynamic(
	() => import("@/components/ui/dialog/confirm-dialog")
);

function ExpenseListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const messages = useMessages();
	const { locale } = useLanguage();
	const { newDate, getMonth, getYear, getStartOfMonth, getEndOfMonth, asUTC } =
		useDateUtils();

	const queryClient = useQueryClient();

	const { space } = useSpaceContext();

	const [period, setPeriod] = useState(() => ({
		year: getYear(),
		month: getMonth(),
	}));

	const startDate = useMemo(
		() =>
			asUTC(
				getStartOfMonth(
					newDate({ year: period.year, monthIndex: period.month })
				)
			),
		[period, newDate, getStartOfMonth, asUTC]
	);
	const endDate = useMemo(
		() =>
			asUTC(
				getEndOfMonth(newDate({ year: period.year, monthIndex: period.month }))
			),
		[period, newDate, getEndOfMonth, asUTC]
	);

	const handlePeriodChange = useCallback(
		(input: { year: number; month: number }) => {
			setPeriod({ ...input });
		},
		[setPeriod]
	);

	const [filterArgs, setFilterArgs] = useState<ExpenseListFilterArgs>({});

	const pagination = usePagination();
	const { pageSize, offset } = pagination;

	const queryArgs = useMemo(() => {
		const where: Prisma.ExpenseWhereInput = {
			AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
		};

		if (filterArgs.title) {
			where.title = { contains: filterArgs.title, mode: "insensitive" };
		}

		// if (filterArgs.date) {
		// 	where.date = filterArgs.date;
		// }

		if (filterArgs.categoryId) {
			where.categoryId = filterArgs.categoryId;
		}

		return {
			where,
			include: { createdBy: true, category: true },
			orderBy: [{ date: "desc" }, { amount: "desc" }],
			skip: offset,
			take: pageSize,
		} satisfies ExpenseFindManyArgs;
	}, [startDate, endDate, filterArgs, offset, pageSize]);

	const {
		data: { data: expenses, count } = {},
		isFetching,
		error,
	} = useQuery({
		queryKey: ["spaces", space.id, "expenses", queryArgs],
		queryFn: async () => await findManyAndCountExpense(space.id, queryArgs),
		placeholderData: keepPreviousData,
	});

	const openFilterDialog = useCallback(async () => {
		await dialogs.open(
			ExpenseListFilterDialog,
			{ spaceId: space.id, filterArgs, setFilterArgs },
			{ messages }
		);
	}, [dialogs, messages, space.id, filterArgs]);

	const openReportDialog = useCallback(async () => {
		await dialogs.open(
			ExpenseMonthReportDialog,
			{ spaceId: space.id, period, startDate, endDate },
			{ messages }
		);
	}, [dialogs, messages, space.id, period, startDate, endDate]);

	const openUpsertDialog = useCallback(
		async (expense?: CustomExpense) => {
			await dialogs.open(ExpenseUpsertDialog, { space, expense }, { messages });
		},
		[dialogs, messages, space]
	);

	const { mutateAsync: handleItemDeleteMutation } = useMutation({
		mutationFn: (id: string) => deleteExpense(id, space.id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", space.id, "expenses"],
			});
		},
	});

	const openDeleteDialog = useCallback(
		async (expense: CustomExpense) => {
			await dialogs.open(ExpenseDeleteDialog, {
				onSubmit: () => handleItemDeleteMutation(expense.id),
			});
		},
		[dialogs, handleItemDeleteMutation]
	);

	const exportManyOp = useMutation({
		mutationFn: () =>
			exportExpense(space.id, {
				locale,
				where: {
					AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
				},
				orderBy: [{ date: "desc" }, { amount: "desc" }],
			}),
	});

	const contextValue = useMemo<ExpenseListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: expenses,
			count,
			pagination,

			period,
			changePeriod: handlePeriodChange,

			filterArgs,
			setFilterArgs,

			openFilterDialog,
			openReportDialog,

			openUpsertDialog,
			openDeleteDialog,

			exportManyOp,
		}),
		[
			isFetching,
			error,
			expenses,
			count,
			pagination,
			period,
			filterArgs,
			setFilterArgs,
			handlePeriodChange,
			openFilterDialog,
			openReportDialog,
			openUpsertDialog,
			openDeleteDialog,
			exportManyOp,
		]
	);

	return <ExpenseListContext value={contextValue} {...props} />;
}

export { ExpenseListProvider };
