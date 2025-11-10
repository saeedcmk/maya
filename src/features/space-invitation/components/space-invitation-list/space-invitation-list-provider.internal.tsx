"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import type { SpaceInvitationFindManyArgs } from "../../models/space-invitation-find-many";
import { deleteSpaceInvitation } from "../../services/delete-space-invitation";
import { findManySpaceInvitation } from "../../services/find-many-space-invitation";
import type { CustomSpaceInvitation } from "./space-invitation-list.types.internal";
import {
	SpaceInvitationListContext,
	type SpaceInvitationListContextType,
} from "./space-invitation-list-context.internal";

const SpaceInvitationUpsertDialog = dynamic(
	() => import("../space-invitation-create")
);

const SpaceInvitationDeleteDialog = dynamic(
	() => import("@/components/ui/dialog/confirm-dialog")
);

const queryArgs = {
	include: { createdBy: true },
	orderBy: { createdAt: "asc" },
} satisfies SpaceInvitationFindManyArgs;

function SpaceInvitationListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const queryClient = useQueryClient();

	const messages = useMessages();

	const { space } = useSpaceContext();

	const {
		data: invitations,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["spaces", space.id, "invitations", queryArgs],
		queryFn: async () => await findManySpaceInvitation(space.id, queryArgs),
	});

	const openUpsertDialog = useCallback(async () => {
		await dialogs.open(SpaceInvitationUpsertDialog, { space }, { messages });
	}, [dialogs, messages, space]);

	const { mutateAsync: handleItemDeleteMutation } = useMutation({
		mutationFn: (id: string) => deleteSpaceInvitation(id, space.id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", space.id, "invitations"],
			});
		},
	});

	const openDeleteDialog = useCallback(
		async (invitation: CustomSpaceInvitation) => {
			await dialogs.open(SpaceInvitationDeleteDialog, {
				onSubmit: () => handleItemDeleteMutation(invitation.id),
			});
		},
		[dialogs, handleItemDeleteMutation]
	);

	const contextValue = useMemo<SpaceInvitationListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: invitations,

			openUpsertDialog,
			openDeleteDialog,
		}),
		[isFetching, error, invitations, openUpsertDialog, openDeleteDialog]
	);

	return <SpaceInvitationListContext value={contextValue} {...props} />;
}

export { SpaceInvitationListProvider };
