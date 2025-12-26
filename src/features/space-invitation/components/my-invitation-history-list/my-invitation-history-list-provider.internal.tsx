"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SpaceInvitationStatus } from "../../enums/space-invitation-status";
import type { SpaceInvitationFindManyArgs } from "../../models/space-invitation-find-many";
import { findManyMyInvitation } from "../../services/find-many-my-invitation";
import {
	MyInvitationHistoryListContext,
	type MyInvitationHistoryListContextType,
} from "./my-invitation-history-list-context.internal";

function MyInvitationHistoryListProvider(props: React.PropsWithChildren) {
	const queryArgs = useMemo(
		() =>
			({
				where: {
					OR: [
						{ status: { not: SpaceInvitationStatus.PENDING } },
						{
							status: SpaceInvitationStatus.PENDING,
							expiresAt: { lt: new Date() },
						},
					],
				},
				include: {
					space: true,
					createdBy: true,
				},
				orderBy: { createdAt: "desc" },
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

	const contextValue = useMemo<MyInvitationHistoryListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: invitations,
		}),
		[isFetching, error, invitations]
	);

	return <MyInvitationHistoryListContext value={contextValue} {...props} />;
}

export { MyInvitationHistoryListProvider };
