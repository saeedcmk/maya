"use client";

import { useTranslations } from "next-intl";
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
import { useMyInvitationHistoryListContext } from "./my-invitation-history-list-context.internal";
import { MyInvitationHistoryListTable } from "./my-invitation-history-list-table.internal";

function MyInvitationHistoryListWidget() {
	const t = useTranslations();

	const {
		items: invitations,
		isLoading,
		error,
	} = useMyInvitationHistoryListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("my-invitation-history-list.title")}</CardTitle>
				</CardInfo>
			</CardHeader>

			{(isLoading && !invitations) || error ? (
				<CardContent>
					{isLoading && !invitations ? (
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
					<MyInvitationHistoryListTable invitations={invitations} />
				</CardBody>
			)}
		</Card>
	);
}

export { MyInvitationHistoryListWidget };
