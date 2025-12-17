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
import { useSpaceListContext } from "./space-list-context.internal";
import { SpaceListTable } from "./space-list-table.internal";

function SpaceListWidget() {
	const t = useTranslations();

	const {
		items: spaces,
		isLoading,
		error,
		openCreateDialog,
	} = useSpaceListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("space-list.title")}</CardTitle>
				</CardInfo>

				<CardActions>
					<Button
						color="primary"
						disabled={isLoading}
						onClick={openCreateDialog}
					>
						<LucidePlus />
						<span>{t("space-list.actions.create")}</span>
					</Button>
				</CardActions>
			</CardHeader>

			{(isLoading && !spaces) || error ? (
				<CardContent>
					{isLoading && !spaces ? (
						<Loading size="sm" />
					) : (
						!!error && (
							<Alert intent="danger">
								<AlertDescription>{error.message}</AlertDescription>
							</Alert>
						)
					)}
				</CardContent>
			) : (
				<CardBody>
					<SpaceListTable />
				</CardBody>
			)}
		</Card>
	);
}

export { SpaceListWidget };
