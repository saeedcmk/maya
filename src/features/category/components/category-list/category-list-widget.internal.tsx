"use client";

import { LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardInfo,
	CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useCategoryListContext } from "./category-list-context.internal";
import { CategoryListGrid } from "./category-list-grid.internal";

function CategoryListWidget() {
	const t = useTranslations();

	const {
		isLoading,
		error,
		items: categories,

		openUpsertDialog,
	} = useCategoryListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("category-list.title")}</CardTitle>
				</CardInfo>
				<CardActions>
					<Button
						color="primary"
						disabled={isLoading}
						type="button"
						onClick={openUpsertDialog.bind(null, undefined)}
					>
						<LucidePlus />
						<span>{t("category-list.actions.create")}</span>
					</Button>
				</CardActions>
			</CardHeader>

			<CardContent>
				{isLoading ? (
					<Loading size="sm" />
				) : !!error ? (
					<Alert intent="danger">
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				) : !!categories?.length ? (
					<CategoryListGrid />
				) : (
					<span className="text-muted-foreground">{t("exprs.empty")}</span>
				)}
			</CardContent>
		</Card>
	);
}

export { CategoryListWidget };
