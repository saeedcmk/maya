"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { SpaceInvitationStatus } from "../../enums/space-invitation-status";
import type { SpaceInvitationFindManyArgs } from "../../models/space-invitation-find-many";
import { decideInvitationStatus } from "../../services/decide-invitation-status";
import { findManyMyInvitation } from "../../services/find-many-my-invitation";
import type { CustomSpaceInvitation } from "./my-invitation-list.types.internal";
import {
	MyInvitationListContext,
	type MyInvitationListContextType,
} from "./my-invitation-list-context.internal";

const SpaceInvitationDeclineDialog = dynamic(
	() => import("@/components/ui/dialog/confirm-dialog")
);

const queryArgs = {
	where: { status: "PENDING" },
	include: { space: true, createdBy: true },
	orderBy: { createdAt: "asc" },
} satisfies SpaceInvitationFindManyArgs;

function MyInvitationListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const queryClient = useQueryClient();

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

	const contextValue = useMemo<MyInvitationListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: invitations,

			acceptOne: acceptInvitationOp,
			openDeclineDialog,
		}),
		[isFetching, error, invitations, acceptInvitationOp, openDeclineDialog]
	);

	return <MyInvitationListContext value={contextValue} {...props} />;
}

export { MyInvitationListProvider };
