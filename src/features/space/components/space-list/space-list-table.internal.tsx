"use client";

import { LucidePenSquare } from "lucide-react";
import Link from "next/link";
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
import { isSpaceOwnerOrAdmin } from "../../utils/isSpaceOwnerOrAdmin";
import type { CustomSpace } from "./space-list.types.internal";
import { useSpaceListContext } from "./space-list-context.internal";

function SpaceListTable() {
	const { session } = useLoggedInUser();

	const { items: spaces, isLoading, openUpdateDialog } = useSpaceListContext();

	const rowContext = useCallback(
		(space: CustomSpace) => {
			const isOwnerOrAdmin = isSpaceOwnerOrAdmin(space, session.userId);

			const canEdit = isOwnerOrAdmin;
			const hasActions = canEdit;

			return {
				canEdit,
				hasActions,
			};
		},
		[session.userId]
	);

	const columns: TableColumn<CustomSpace, ReturnType<typeof rowContext>>[] =
		useMemo(
			() => [
				tableRowNumberColumn(),
				{
					key: "name",
					title: (t) => t("space.name"),
					render: (space) => (
						<Link href={`/dashboard/spaces/${space.id}`}>{space.name}</Link>
					),
				},
				{
					key: "type",
					title: (t) => t("space.type"),
					render: (space, { t }) => t(`space-type.${space.type}`),
				},
				{
					key: "createdAt",
					title: (t) => t("exprs.created_at"),
					render: (space) => <DateTime date={space.createdAt} />,
					width: 256,
				},
				{
					key: "updatedAt",
					title: (t) => t("exprs.updated_at"),
					render: (space) => <DateTime date={space.updatedAt} />,
					width: 256,
				},
				{
					key: "actions",
					title: (t) => t("exprs.actions"),
					render: (space, { t, isLoading, context: { canEdit, hasActions } }) =>
						hasActions && (
							<TableActions>
								{canEdit && (
									<TableAction
										disabled={isLoading}
										tooltip={t("space-list.item.actions.edit")}
										onClick={openUpdateDialog.bind(null, space)}
									>
										<LucidePenSquare />
									</TableAction>
								)}
							</TableActions>
						),
					width: 112,
				},
			],
			[openUpdateDialog]
		);

	return (
		<Table
			columns={columns}
			items={spaces}
			loading={isLoading}
			rowKey="id"
			rowContext={rowContext}
		/>
	);
}

export { SpaceListTable };
