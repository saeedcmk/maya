"use client";

import { LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardActions,
	CardBody,
	CardContent,
	CardHeader,
	CardInfo,
	CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useRecentExpenseListContext } from "./recent-expense-list-context.internal";
import { RecentExpenseListTable } from "./recent-expense-list-table.internal";

function RecentExpenseListWidget() {
	const t = useTranslations();

	const {
		isLoading,
		error,
		items: expenses,

		openCreateDialog,
	} = useRecentExpenseListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("recent-expense-list.title")}</CardTitle>
				</CardInfo>
				<CardActions>
					<Button
						color="primary"
						disabled={isLoading}
						type="button"
						onClick={openCreateDialog.bind(null, undefined)}
					>
						<LucidePlus />
						<span>{t("recent-expense-list.actions.create")}</span>
					</Button>
				</CardActions>
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
				<CardBody>
					<div className="space-y-6">
						<RecentExpenseListTable />
					</div>
				</CardBody>
			)}
		</Card>
	);
}

export { RecentExpenseListWidget };
