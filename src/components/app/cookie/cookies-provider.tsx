"use client";

import { CookiesProvider as Provider } from "react-cookie";

function CookiesProvider({ children }: React.PropsWithChildren) {
	return <Provider>{children}</Provider>;
}

export { CookiesProvider };
