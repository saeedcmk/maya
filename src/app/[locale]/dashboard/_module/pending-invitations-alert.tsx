"use client";

import { useQuery } from "@tanstack/react-query";
import { LucideArrowRight, LucideMailOpen } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
	Alert,
	AlertAction,
	AlertActions,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { SpaceInvitationStatus } from "@/features/space-invitation/enums/space-invitation-status";
import { SpaceInvitationCountArgs } from "@/features/space-invitation/models/space-invitation-count";
import { countMyInvitation } from "@/features/space-invitation/services/count-my-invitation";
import { routes } from "@/lib/routes";

const queryArgs = {
	where: { status: SpaceInvitationStatus.PENDING },
} satisfies SpaceInvitationCountArgs;

function PendingInvitationsAlert() {
	const t = useTranslations();

	const { data: count, isLoading } = useQuery({
		queryKey: ["invitations", "count", queryArgs],
		queryFn: () => countMyInvitation(queryArgs),
		staleTime: 15 * 60 * 1000, // 15m
	});

	if (isLoading || !count) {
		return null;
	}

	return (
		<Alert intent="info">
			<LucideMailOpen />
			<AlertTitle>{t("pending-invitations-alert.title")}</AlertTitle>
			<AlertDescription>
				{t("pending-invitations-alert.description", { count })}
			</AlertDescription>
			<AlertActions>
				<AlertAction asChild>
					<Link href={routes.invitations.url()} prefetch={false}>
						<LucideArrowRight className="rtl:rotate-180" />
						<span>{t("pending-invitations-alert.actions.view")}</span>
					</Link>
				</AlertAction>
			</AlertActions>
		</Alert>
	);
}

export { PendingInvitationsAlert };
