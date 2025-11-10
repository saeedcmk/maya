"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomSpaceInvitation } from "./space-invitation-list.types.internal";

type SpaceInvitationListContextType =
	EntityListContextType<CustomSpaceInvitation> & {
		openUpsertDialog: (invitation?: CustomSpaceInvitation) => Promise<void>;
		openDeleteDialog: (invitation: CustomSpaceInvitation) => Promise<void>;
	};

const SpaceInvitationListContext =
	createContext<SpaceInvitationListContextType | null>(null);

function useSpaceInvitationListContext(): SpaceInvitationListContextType {
	return useContextCreator(SpaceInvitationListContext);
}

export type { SpaceInvitationListContextType };
export { SpaceInvitationListContext, useSpaceInvitationListContext };
