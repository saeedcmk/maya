"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { FilterBar } from "@/components/app/filters/filter-bar";
import { FilterBarConfig } from "@/components/app/filters/filter-bar.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardBody,
	CardContent,
	CardHeader,
	CardInfo,
	CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Pagination } from "@/components/ui/pagination/pagination.internal";
import { useCategoryOptions } from "@/features/category/hooks/use-category-options";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { ExpenseListFilterArgs } from "./expense-list.types.internal";
import { useExpenseListContext } from "./expense-list-context.internal";
import { ExpenseListTable } from "./expense-list-table.internal";
import { ExpenseListWidgetActions } from "./expense-list-widget-actions.internal";

function ExpenseListWidget() {
	const t = useTranslations();

	const { space } = useSpaceContext();

	const {
		isLoading,
		error,
		items: expenses,
		count,
		pagination,

		filterArgs,
		setFilterArgs,
	} = useExpenseListContext();

	const { data: categoryOptions } = useCategoryOptions(space.id);

	const filterBarConfig = useMemo(
		() =>
			({
				title: {
					title: (t) => t("expense.title"),
				},
				categoryId: {
					title: (t) => t("expense.category"),
					render: (value) =>
						categoryOptions?.find(
							(categoryOption) => categoryOption.value === value
						)?.label ?? value,
				},
			}) satisfies FilterBarConfig<ExpenseListFilterArgs>,
		[categoryOptions]
	);

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("expense-list.title")}</CardTitle>
				</CardInfo>

				<ExpenseListWidgetActions />
			</CardHeader>

			{(isLoading && !expenses) || error ? (
				<CardContent>
					{isLoading && !expenses ? (
						<Loading size="sm" />
					) : (
						!!error && (
							<Alert variant="destructive">
								<AlertDescription>{error.message}</AlertDescription>
							</Alert>
						)
					)}
				</CardContent>
			) : (
				<>
					<FilterBar
						filterArgs={filterArgs}
						setFilterArgs={setFilterArgs}
						config={filterBarConfig}
					/>

					<CardBody>
						<div className="space-y-6">
							<ExpenseListTable />
							<Pagination {...pagination} count={count} />
						</div>
					</CardBody>
				</>
			)}
		</Card>
	);
}

export { ExpenseListWidget };
