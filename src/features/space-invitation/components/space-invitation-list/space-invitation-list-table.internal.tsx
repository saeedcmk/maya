"use client";

import { LucideTrash } from "lucide-react";
import { useMemo } from "react";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import {
	TableAction,
	TableActions,
} from "@/components/ui/table/table.primitives";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { resolveInvitationStatus } from "../../utils/resolve-invitation-status";
import type { CustomSpaceInvitation } from "./space-invitation-list.types.internal";
import { useSpaceInvitationListContext } from "./space-invitation-list-context.internal";

function SpaceInvitationListTable() {
	const { isOwnerOrAdmin } = useSpaceContext();
	const {
		items: invitations,
		isLoading,
		openDeleteDialog,
	} = useSpaceInvitationListContext();

	const canDelete = isOwnerOrAdmin;
	const haveActions = canDelete;

	const columns: TableColumn<CustomSpaceInvitation>[] = useMemo(
		() => [
			tableRowNumberColumn(),
			{
				key: "userPublicId",
				title: (t) => t("space-invitation.user_public_id"),
			},
			{
				key: "status",
				title: (t) => t("space-invitation.status"),
				render: (invitation, { t }) =>
					t(`space-invitation-status.${resolveInvitationStatus(invitation)}`),
				width: 256,
				skeleton: 2,
			},
			{
				key: "expiresAt",
				title: (t) => t("exprs.expires_at"),
				render: (invitation) => <DateTime date={invitation.expiresAt} />,
				width: 128,
			},
			{
				key: "resolvedAt",
				title: (t) => t("space-invitation.resolved_at"),
				render: (invitation) =>
					invitation.resolvedAt && <DateTime date={invitation.expiresAt} />,
				defaultValue: "-",
				width: 256,
				skeleton: 2,
			},
			{
				key: "actions",
				title: (t) => t("exprs.actions"),
				if: haveActions,
				render: (invitation, { t, isLoading }) => (
					<TableActions>
						{canDelete && (
							<TableAction
								disabled={isLoading}
								tooltip={t("space-invitation-list.item.actions.delete")}
								onClick={openDeleteDialog.bind(null, invitation)}
							>
								<LucideTrash />
							</TableAction>
						)}
					</TableActions>
				),
				width: 112,
			},
		],
		[haveActions, canDelete, openDeleteDialog]
	);

	return (
		<Table
			columns={columns}
			items={invitations}
			loading={isLoading}
			rowKey="id"
		/>
	);
}

export { SpaceInvitationListTable };
