"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

type UseToggleReturn = [boolean, Dispatch<SetStateAction<boolean>>];

function useToggle(initialState?: boolean): UseToggleReturn {
	return useState<boolean>(initialState ?? false);
}

export { useToggle };
