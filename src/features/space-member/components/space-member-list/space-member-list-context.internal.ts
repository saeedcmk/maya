"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import { SpaceMember } from "../../types/space-member";

type SpaceMemberListContextType = {
	openRoleUpdateDialog: (member: SpaceMember) => Promise<void>;
	openRemoveDialog: (member: SpaceMember) => Promise<void>;
};

const SpaceMemberListContext = createContext<SpaceMemberListContextType | null>(
	null
);

function useSpaceMemberListContext(): SpaceMemberListContextType {
	return useContextCreator(SpaceMemberListContext);
}

export type { SpaceMemberListContextType };
export { SpaceMemberListContext, useSpaceMemberListContext };
