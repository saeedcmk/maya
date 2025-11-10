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
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { useSpaceInvitationListContext } from "./space-invitation-list-context.internal";
import { SpaceInvitationListTable } from "./space-invitation-list-table.internal";

function SpaceInvitationListWidget() {
	const t = useTranslations();

	const { isOwnerOrAdmin } = useSpaceContext();
	const {
		items: invitations,
		isLoading,
		error,
		openUpsertDialog,
	} = useSpaceInvitationListContext();

	const canCreate = isOwnerOrAdmin;

	const haveActions = canCreate;

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("space-invitation-list.title")}</CardTitle>
				</CardInfo>

				{haveActions && (
					<CardActions>
						{canCreate && (
							<Button
								color="primary"
								disabled={isLoading}
								onClick={openUpsertDialog.bind(null, undefined)}
							>
								<LucidePlus />
								<span>{t("space-invitation-list.actions.create")}</span>
							</Button>
						)}
					</CardActions>
				)}
			</CardHeader>

			{(isLoading && !invitations) || error ? (
				<CardContent>
					{isLoading && !invitations ? (
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
					<SpaceInvitationListTable />
				</CardBody>
			)}
		</Card>
	);
}

export { SpaceInvitationListWidget };
