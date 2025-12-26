"use client";

import { useMemo } from "react";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import { resolveInvitationStatus } from "../../utils/resolve-invitation-status";
import type { CustomSpaceInvitation } from "./my-invitation-history-list.types.internal";
import { useMyInvitationHistoryListContext } from "./my-invitation-history-list-context.internal";

function MyInvitationHistoryListTable({
	invitations,
}: {
	invitations: CustomSpaceInvitation[] | undefined;
}) {
	const { isLoading } = useMyInvitationHistoryListContext();

	const columns: TableColumn<CustomSpaceInvitation>[] = useMemo(
		() => [
			tableRowNumberColumn(),
			{
				key: "createdBy",
				title: (t) => t("space-invitation.created_by"),
				render: (invitation) => invitation.createdBy.nickname,
				width: 256,
			},
			{
				key: "space",
				title: (t) => t("space-invitation.space"),
				render: (invitation) => invitation.space.name,
			},
			{
				key: "status",
				title: (t) => t("space-invitation.status"),
				render: (invitation, { t }) =>
					t(`space-invitation-status.${resolveInvitationStatus(invitation)}`),
				width: 128,
			},
			{
				key: "resolvedAt",
				title: (t) => t("space-invitation.resolved_at"),
				render: (invitation) => <DateTime date={invitation.resolvedAt!} />,
				width: 256,
				skeleton: 2,
			},
		],
		[]
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

export { MyInvitationHistoryListTable };
