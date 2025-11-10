"use client";

import { LucideTrash, LucideUserPen } from "lucide-react";
import { useCallback, useMemo } from "react";
import { DateTime } from "@/components/ui/datetime";
import { Table } from "@/components/ui/table";
import {
	TableAction,
	TableActions,
} from "@/components/ui/table/table.primitives";
import type { TableColumn } from "@/components/ui/table/table.types";
import { tableRowNumberColumn } from "@/components/ui/table/table.utils";
import { useLoggedInUser } from "@/features/auth/hooks/use-logged-in-user";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { SpaceMemberRole } from "../../enums/space-member-role";
import { CustomSpaceMember } from "./space-member-list.types.internal";
import { useSpaceMemberListContext } from "./space-member-list-context.internal";

function SpaceMemberListTable() {
	const { session } = useLoggedInUser();

	const {
		space: { members },
		isOwnerOrAdmin,
		isLoading,
	} = useSpaceContext();

	const { openRoleUpdateDialog, openRemoveDialog } =
		useSpaceMemberListContext();

	const haveActions = isOwnerOrAdmin;

	const rowContext = useCallback(
		(member: CustomSpaceMember) => {
			const canUpdateRole =
				isOwnerOrAdmin &&
				member.userId !== session.userId &&
				member.role !== SpaceMemberRole.OWNER;
			const canRemove = isOwnerOrAdmin && member.role !== SpaceMemberRole.OWNER;
			const hasActions = canUpdateRole || canRemove;

			return { canUpdateRole, canRemove, hasActions };
		},
		[session.userId, isOwnerOrAdmin]
	);

	const columns: TableColumn<
		CustomSpaceMember,
		ReturnType<typeof rowContext>
	>[] = useMemo(
		() => [
			tableRowNumberColumn(),
			{
				key: "user",
				title: (t) => t("space-member.user"),
				render: (member) => member.user.nickname,
			},
			{
				key: "role",
				title: (t) => t("space-member.role"),
				render: (member, { t }) => t(`space-member-role.${member.role}`),
				width: 160,
			},
			{
				key: "joinedAt",
				title: (t) => t("exprs.joined_at"),
				render: (member) => <DateTime date={member.joinedAt} />,
				width: 256,
				skeleton: 2,
			},
			{
				key: "actions",
				title: (t) => t("exprs.actions"),
				if: haveActions,
				render: (
					member,
					{ t, context: { canUpdateRole, canRemove, hasActions } }
				) =>
					hasActions && (
						<TableActions>
							{canUpdateRole && (
								<TableAction
									disabled={isLoading}
									tooltip={t("space-member-list.item.actions.role_update")}
									onClick={openRoleUpdateDialog.bind(null, member)}
								>
									<LucideUserPen />
								</TableAction>
							)}

							{canRemove && (
								<TableAction
									disabled={isLoading}
									tooltip={t("space-member-list.item.actions.remove")}
									onClick={openRemoveDialog.bind(null, member)}
								>
									<LucideTrash />
								</TableAction>
							)}
						</TableActions>
					),
				width: 112,
			},
		],
		[isLoading, haveActions, openRoleUpdateDialog, openRemoveDialog]
	);

	return (
		<Table
			columns={columns}
			items={members}
			rowKey="id"
			rowContext={rowContext}
		/>
	);
}

export { SpaceMemberListTable };
