"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomSpaceInvitation } from "./my-invitation-history-list.types.internal";

type MyInvitationHistoryListContextType =
	EntityListContextType<CustomSpaceInvitation>;

const MyInvitationHistoryListContext =
	createContext<MyInvitationHistoryListContextType | null>(null);

function useMyInvitationHistoryListContext(): MyInvitationHistoryListContextType {
	return useContextCreator(MyInvitationHistoryListContext);
}

export type { MyInvitationHistoryListContextType };
export { MyInvitationHistoryListContext, useMyInvitationHistoryListContext };
