"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardHeader,
	CardInfo,
	CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useMyPendingInvitationListContext } from "./my-pending-invitation-list-context.internal";
import { MyPendingInvitationListStack } from "./my-pending-invitation-list-stack.internal";

function MyPendingInvitationListWidget() {
	const t = useTranslations();

	const {
		items: invitations,
		isLoading,
		error,
	} = useMyPendingInvitationListContext();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("my-pending-invitation-list.title")}</CardTitle>
				</CardInfo>
			</CardHeader>

			<CardContent>
				{isLoading && !invitations ? (
					<Loading size="sm" />
				) : !!error ? (
					<Alert intent="danger">
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				) : (
					<MyPendingInvitationListStack invitations={invitations} />
				)}
			</CardContent>
		</Card>
	);
}

export { MyPendingInvitationListWidget };
