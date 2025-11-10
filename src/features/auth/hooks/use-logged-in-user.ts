"use client";

import type { NonNullableFields } from "@/lib/utils/types";
import { type AuthContextType } from "../contexts/auth-context";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { useAuth } from "./use-auth";

function useLoggedInUser(): NonNullableFields<AuthContextType> {
	const { session } = useAuth();

	if (!session) {
		throw new UnauthorizedError();
	}

	return { session };
}

export { useLoggedInUser };
