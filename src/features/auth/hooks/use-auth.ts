"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../contexts/auth-context";

function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider");
	}

	return context;
}

export { useAuth };
