"use client";

import { LucideCheck, LucideX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateTime } from "@/components/ui/datetime";
import type { CustomSpaceInvitation } from "./my-pending-invitation-list.types.internal";
import { useMyPendingInvitationListContext } from "./my-pending-invitation-list-context.internal";

function MyPendingInvitationListStack({
	invitations,
}: {
	invitations: CustomSpaceInvitation[] | undefined;
}) {
	const t = useTranslations();

	const [updatePendingOnes, setUpdatePendingOnes] = useState<
		CustomSpaceInvitation[]
	>([]);

	const { isLoading, acceptOne, openDeclineDialog } =
		useMyPendingInvitationListContext();

	const handleItemAcceptClick = useCallback(
		async (invitation: CustomSpaceInvitation) => {
			setUpdatePendingOnes((prev) => [...prev, invitation]);

			try {
				await acceptOne(invitation.id);
			} finally {
				setUpdatePendingOnes((prev) =>
					prev.filter((x) => x.id !== invitation.id)
				);
			}
		},
		[acceptOne]
	);

	return invitations?.length ? (
		<div>
			{invitations.map((invitation) => {
				const isPending = updatePendingOnes.some((x) => x.id === invitation.id);

				return (
					<Card
						key={invitation.id}
						className="to-muted bg-linear-to-b from-white shadow-none sm:bg-linear-to-r sm:rtl:bg-linear-to-l"
					>
						<CardContent className="flex flex-col gap-x-6 gap-y-6 sm:flex-row sm:flex-wrap sm:justify-between">
							<div className="space-y-0.5">
								<div>
									{t("my-pending-invitation-list.item.invited_by", {
										name: invitation.createdBy.nickname,
									})}
								</div>
								<div>
									{t("my-pending-invitation-list.item.space", {
										name: invitation.space.name,
									})}
								</div>
							</div>

							<div className="space-y-0.5">
								<div>{t("my-pending-invitation-list.item.expires_at")}</div>
								<DateTime
									date={invitation.expiresAt}
									render={({ time, date, separator }) => (
										<div>{`${time}${separator} ${date}`}</div>
									)}
								/>
							</div>

							<div className="flex flex-col gap-x-3 gap-y-1 sm:basis-full sm:flex-row-reverse sm:items-center lg:basis-auto">
								<Button
									color="inverse"
									disabled={isLoading || isPending}
									size="sm"
									type="button"
									variant="contained"
									onClick={handleItemAcceptClick.bind(null, invitation)}
								>
									<LucideCheck />
									{t("my-pending-invitation-list.item.actions.accept")}
								</Button>

								<Button
									color="inverse"
									disabled={isLoading || isPending}
									size="sm"
									type="button"
									variant="outline"
									onClick={openDeclineDialog.bind(null, invitation)}
								>
									<LucideX />
									{t("my-pending-invitation-list.item.actions.decline")}
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	) : (
		<span className="text-muted-foreground">{t("exprs.empty")}</span>
	);
}

export { MyPendingInvitationListStack };
