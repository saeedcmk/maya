"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { removeMemberFromSpace } from "../../services/remove-member-from-space";
import type { SpaceMember } from "../../types/space-member";
import {
	SpaceMemberListContext,
	type SpaceMemberListContextType,
} from "./space-member-list-context.internal";

const SpaceMemberRoleUpdateDialog = dynamic(
	() => import("../space-member-role-update")
);

const SpaceMemberRemoveDialog = dynamic(
	() => import("@/components/ui/dialog/confirm-dialog")
);

function SpaceMemberListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const messages = useMessages();

	const queryClient = useQueryClient();

	const { space } = useSpaceContext();

	const { mutateAsync: removeMutation } = useMutation({
		mutationFn: (id: string) => removeMemberFromSpace(space.id, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["spaces", space.id, "root"] });
		},
	});

	const openRoleUpdateDialog = useCallback(
		async (member: SpaceMember) => {
			await dialogs.open(
				SpaceMemberRoleUpdateDialog,
				{
					spaceId: space.id,
					member: member,
				},
				{ messages }
			);
		},
		[dialogs, messages, space.id]
	);

	const openRemoveDialog = useCallback(
		async (member: SpaceMember) => {
			await dialogs.open(SpaceMemberRemoveDialog, {
				onSubmit: () => removeMutation(member.id),
			});
		},
		[dialogs, removeMutation]
	);

	const contextValue = useMemo<SpaceMemberListContextType>(
		() => ({
			openRoleUpdateDialog,
			openRemoveDialog,
		}),
		[openRoleUpdateDialog, openRemoveDialog]
	);

	return <SpaceMemberListContext value={contextValue} {...props} />;
}

export { SpaceMemberListProvider };
