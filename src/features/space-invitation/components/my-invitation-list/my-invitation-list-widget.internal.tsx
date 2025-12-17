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
import { useMyInvitationListContext } from "./my-invitation-list-context.internal";
import { MyInvitationListTable } from "./my-invitation-list-table.internal";

function MyInvitationListWidget() {
	const t = useTranslations();

	const { items: invitations, isLoading, error } = useMyInvitationListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("my-invitation-list.title")}</CardTitle>
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
					<MyInvitationListTable invitations={invitations} />
				</CardBody>
			)}
		</Card>
	);
}

export { MyInvitationListWidget };
