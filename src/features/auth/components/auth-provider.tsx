"use client";

import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME } from "../auth-consts";
import { AuthContext } from "../contexts/auth-context";
import { getSession } from "../services/get-session";
import type { Session } from "../types/session";

function AuthProvider({
	children,
	session: initialSession,
}: React.PropsWithChildren & { session: Session | null }) {
	const [cookies] = useCookies([JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME]);

	const accessToken: string | undefined =
		cookies[JWT_ACCESS_TOKEN_NAME] ?? undefined;

	const refreshToken: string | undefined =
		cookies[JWT_REFRESH_TOKEN_NAME] ?? undefined;

	const [session, setSession] = useState<Session | null>(
		initialSession ?? null
	);

	const isFirstRun = useRef<boolean>(true);

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			if (initialSession) return;
		}

		(async () => {
			if (accessToken) {
				const identity = await getSession();
				setSession(identity);
			} else if (!refreshToken) {
				setSession(null);
			}
		})();
	}, [initialSession, accessToken, refreshToken]);

	return <AuthContext value={{ session }}>{children}</AuthContext>;
}

export { AuthProvider };
