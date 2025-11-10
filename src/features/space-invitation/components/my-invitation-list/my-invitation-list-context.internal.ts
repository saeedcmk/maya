"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomSpaceInvitation } from "./my-invitation-list.types.internal";

type MyInvitationListContextType =
	EntityListContextType<CustomSpaceInvitation> & {
		acceptOne: (id: string) => Promise<void>;
		openDeclineDialog: (invitation: CustomSpaceInvitation) => Promise<void>;
	};

const MyInvitationListContext =
	createContext<MyInvitationListContextType | null>(null);

function useMyInvitationListContext(): MyInvitationListContextType {
	return useContextCreator(MyInvitationListContext);
}

export type { MyInvitationListContextType };
export { MyInvitationListContext, useMyInvitationListContext };
