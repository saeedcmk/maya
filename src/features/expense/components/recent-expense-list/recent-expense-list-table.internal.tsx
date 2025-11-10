"use client";

import { useMemo } from "react";
import { DateOnly } from "@/components/ui/date-only";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import { SpaceType } from "@/features/space/enums/space-type";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { useLanguage } from "@/lib/i18n/hooks/use-language";
import type { CustomExpense } from "./recent-expense-list.types.internal";
import { useRecentExpenseListContext } from "./recent-expense-list-context.internal";

function RecentExpenseListTable() {
	const { intl } = useLanguage();

	const { space } = useSpaceContext();
	const { items: expenses, isLoading } = useRecentExpenseListContext();

	const columns: TableColumn<CustomExpense>[] = useMemo(
		() => [
			tableRowNumberColumn(),
			{
				key: "title",
				title: (t) => t("expense.title"),
			},
			{
				key: "amount",
				title: (t) => t("expense.amount"),
				render: (expense) =>
					new Intl.NumberFormat(intl).format(+expense.amount),
				width: 160,
			},
			{
				key: "date",
				title: (t) => t("expense.date"),
				render: (expense) => <DateOnly date={expense.date} />,
				width: 208,
			},
			{
				key: "category",
				title: (t) => t("expense.category"),
				render: (expense) => expense.category?.title,
				width: 192,
			},
			{
				key: "createdBy",
				title: (t) => t("exprs.created_by"),
				render: (expense) => expense.createdBy?.nickname,
				if: space.type === SpaceType.GROUP,
				width: 192,
			},
			{
				key: "createdAt",
				title: (t) => t("exprs.created_at"),
				render: (expense) => <DateTime date={expense.createdAt} />,
				width: 208,
			},
			{
				key: "updatedAt",
				title: (t) => t("exprs.updated_at"),
				render: (expense) => <DateTime date={expense.updatedAt} />,
				width: 208,
			},
		],
		[intl, space.type]
	);

	return (
		<Table columns={columns} items={expenses} loading={isLoading} rowKey="id" />
	);
}

export { RecentExpenseListTable };
