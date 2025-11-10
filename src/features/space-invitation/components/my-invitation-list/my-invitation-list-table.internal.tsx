"use client";

import { LucideCheck, LucideX } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import {
	TableAction,
	TableActions,
} from "@/components/ui/table/table.primitives";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import type { CustomSpaceInvitation } from "./my-invitation-list.types.internal";
import { useMyInvitationListContext } from "./my-invitation-list-context.internal";

function MyInvitationListTable({
	invitations,
}: {
	invitations: CustomSpaceInvitation[] | undefined;
}) {
	const [updatePendingOnes, setUpdatePendingOnes] = useState<
		CustomSpaceInvitation[]
	>([]);

	const { isLoading, acceptOne, openDeclineDialog } =
		useMyInvitationListContext();

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

	const columns: TableColumn<CustomSpaceInvitation, { isPending: boolean }>[] =
		useMemo(
			() => [
				tableRowNumberColumn(),
				{
					key: "space",
					title: (t) => t("space-invitation.space"),
					render: (invitation) => invitation.space.name,
				},
				{
					key: "createdBy",
					title: (t) => t("my-invitation-list.columns.invited_by"),
					render: (invitation) => invitation.createdBy.nickname,
					width: 256,
				},
				{
					key: "expiresAt",
					title: (t) => t("exprs.expires_at"),
					render: (invitation) => <DateTime date={invitation.expiresAt} />,
					width: 256,
					skeleton: 2,
				},
				{
					key: "actions",
					title: (t) => t("exprs.actions"),
					render: (invitation, { t, isLoading, context: { isPending } }) => (
						<TableActions>
							<TableAction
								disabled={isLoading || isPending}
								tooltip={t("my-invitation-list.item.actions.accept")}
								onClick={handleItemAcceptClick.bind(null, invitation)}
							>
								<LucideCheck />
							</TableAction>

							<TableAction
								disabled={isLoading || isPending}
								tooltip={t("my-invitation-list.item.actions.decline")}
								onClick={openDeclineDialog.bind(null, invitation)}
							>
								<LucideX />
							</TableAction>
						</TableActions>
					),
					width: 112,
				},
			],
			[handleItemAcceptClick, openDeclineDialog]
		);

	return (
		<Table
			columns={columns}
			items={invitations}
			loading={isLoading}
			rowKey="id"
			rowContext={(invitation) => ({
				isPending: updatePendingOnes.some((x) => x.id === invitation.id),
			})}
		/>
	);
}

export { MyInvitationListTable };
