"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { CustomSpace } from "./space-list.types.internal";

type SpaceListContextType = EntityListContextType<CustomSpace> & {
	openCreateDialog: () => Promise<void>;
	openUpdateDialog: (space: CustomSpace) => Promise<void>;
};

const SpaceListContext = createContext<SpaceListContextType | null>(null);

function useSpaceListContext(): SpaceListContextType {
	return useContextCreator(SpaceListContext);
}

export type { SpaceListContextType };
export { SpaceListContext, useSpaceListContext };
