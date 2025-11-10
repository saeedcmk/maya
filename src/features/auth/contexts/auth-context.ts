"use client";

import { createContext } from "react";
import type { Session } from "../types/session";

type AuthContextType = {
	session: Session | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export type { AuthContextType };
export { AuthContext };
