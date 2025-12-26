"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomSpaceInvitation } from "./my-pending-invitation-list.types.internal";

type MyPendingInvitationListContextType =
	EntityListContextType<CustomSpaceInvitation> & {
		acceptOne: (id: string) => Promise<void>;
		openDeclineDialog: (invitation: CustomSpaceInvitation) => Promise<void>;
	};

const MyPendingInvitationListContext =
	createContext<MyPendingInvitationListContextType | null>(null);

function useMyPendingInvitationListContext(): MyPendingInvitationListContextType {
	return useContextCreator(MyPendingInvitationListContext);
}

export type { MyPendingInvitationListContextType };
export { MyPendingInvitationListContext, useMyPendingInvitationListContext };
