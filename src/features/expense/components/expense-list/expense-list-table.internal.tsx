"use client";

import { LucidePenSquare, LucideTrash } from "lucide-react";
import { useCallback, useMemo } from "react";
import { DateOnly } from "@/components/ui/date-only";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import {
	TableAction,
	TableActions,
} from "@/components/ui/table/table.primitives";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import { useLoggedInUser } from "@/features/auth/hooks/use-logged-in-user";
import { SpaceType } from "@/features/space/enums/space-type";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { useLanguage } from "@/lib/i18n/hooks/use-language";
import type { CustomExpense } from "./expense-list.types.internal";
import { useExpenseListContext } from "./expense-list-context.internal";

function ExpenseListTable() {
	const { intl } = useLanguage();

	const { session } = useLoggedInUser();

	const { space, isOwnerOrAdmin } = useSpaceContext();

	const {
		isLoading,
		items: expenses,
		pagination: { pageSize, offset },
		openUpsertDialog,
		openDeleteDialog,
	} = useExpenseListContext();

	const rowContext = useCallback(
		(expense: CustomExpense) => {
			const canEdit = expense.createdById === session.userId || isOwnerOrAdmin;
			const canDelete =
				expense.createdById === session.userId || isOwnerOrAdmin;
			const hasActions = canEdit || canDelete;

			return {
				canEdit,
				canDelete,
				hasActions,
			};
		},
		[isOwnerOrAdmin, session.userId]
	);

	const columns: TableColumn<CustomExpense, ReturnType<typeof rowContext>>[] =
		useMemo(
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
				{
					key: "actions",
					title: (t) => t("exprs.actions"),
					render: (
						expense,
						{ t, isLoading, context: { canEdit, canDelete, hasActions } }
					) =>
						hasActions && (
							<TableActions>
								{canEdit && (
									<TableAction
										tooltip={t("expense-list.item.actions.edit")}
										onClick={openUpsertDialog.bind(null, expense)}
									>
										<LucidePenSquare />
									</TableAction>
								)}

								{canDelete && (
									<TableAction
										disabled={isLoading}
										tooltip={t("expense-list.item.actions.delete")}
										onClick={openDeleteDialog.bind(null, expense)}
									>
										<LucideTrash />
									</TableAction>
								)}
							</TableActions>
						),
					width: 128,
				},
			],
			[intl, space.type, openUpsertDialog, openDeleteDialog]
		);

	return (
		<Table
			columns={columns}
			items={expenses}
			loading={isLoading}
			offset={offset}
			rowKey="id"
			rowCount={pageSize}
			rowContext={rowContext}
		/>
	);
}

export { ExpenseListTable };
