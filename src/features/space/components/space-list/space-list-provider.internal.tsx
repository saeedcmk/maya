"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import type { SpaceFindManyArgs } from "../../models/space-find-many";
import { findManySpace } from "../../services/find-many-space";
import type { CustomSpace } from "./space-list.types.internal";
import {
	SpaceListContext,
	type SpaceListContextType,
} from "./space-list-context.internal";

const SpaceCreateDialog = dynamic(() => import("../space-create"));

const SpaceUpdateDialog = dynamic(() => import("../space-update"));

const queryArgs = {
	include: { owner: true },
	orderBy: { name: "asc" },
} satisfies SpaceFindManyArgs;

function SpaceListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const messages = useMessages();

	const {
		data: spaces,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["spaces", "root", queryArgs],
		queryFn: async () => await findManySpace(queryArgs),
	});

	const openCreateDialog = useCallback(async () => {
		await dialogs.open(SpaceCreateDialog, undefined, { messages });
	}, [dialogs, messages]);

	const openUpdateDialog = useCallback(
		async (space: CustomSpace) => {
			await dialogs.open(SpaceUpdateDialog, { space }, { messages });
		},
		[dialogs, messages]
	);

	const contextValue = useMemo<SpaceListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: spaces,

			openCreateDialog,
			openUpdateDialog,
		}),
		[isFetching, error, spaces, openCreateDialog, openUpdateDialog]
	);

	return <SpaceListContext value={contextValue} {...props} />;
}

export { SpaceListProvider };
