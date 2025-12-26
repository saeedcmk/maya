"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { SpaceInvitationStatus } from "../../enums/space-invitation-status";
import type { SpaceInvitationFindManyArgs } from "../../models/space-invitation-find-many";
import { decideInvitationStatus } from "../../services/decide-invitation-status";
import { findManyMyInvitation } from "../../services/find-many-my-invitation";
import type { CustomSpaceInvitation } from "./my-pending-invitation-list.types.internal";
import {
	MyPendingInvitationListContext,
	type MyPendingInvitationListContextType,
} from "./my-pending-invitation-list-context.internal";

const SpaceInvitationDeclineDialog = dynamic(
	() => import("@/components/ui/dialog/confirm-dialog")
);

function MyPendingInvitationListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const queryClient = useQueryClient();

	const queryArgs = useMemo(
		() =>
			({
				where: {
					status: SpaceInvitationStatus.PENDING,
					expiresAt: { gt: new Date() },
				},
				include: { space: true, createdBy: true },
				orderBy: { createdAt: "asc" },
			}) satisfies SpaceInvitationFindManyArgs,
		[]
	);

	const {
		data: invitations,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["invitations", queryArgs],
		queryFn: () => findManyMyInvitation(queryArgs),
	});

	const { mutateAsync: acceptInvitationOp } = useMutation({
		mutationFn: (id: string) =>
			decideInvitationStatus(id, SpaceInvitationStatus.ACCEPTED),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["invitations"],
			});
		},
	});

	const { mutateAsync: declineInvitationOp } = useMutation({
		mutationFn: (id: string) =>
			decideInvitationStatus(id, SpaceInvitationStatus.DECLINED),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["invitations"],
			});
		},
	});

	const openDeclineDialog = useCallback(
		async (invitation: CustomSpaceInvitation) => {
			await dialogs.open(SpaceInvitationDeclineDialog, {
				onSubmit: () => declineInvitationOp(invitation.id),
			});
		},
		[dialogs, declineInvitationOp]
	);

	const contextValue = useMemo<MyPendingInvitationListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: invitations,

			acceptOne: acceptInvitationOp,
			openDeclineDialog,
		}),
		[isFetching, error, invitations, acceptInvitationOp, openDeclineDialog]
	);

	return <MyPendingInvitationListContext value={contextValue} {...props} />;
}

export { MyPendingInvitationListProvider };
