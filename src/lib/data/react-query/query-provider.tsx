"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupQuerySync } from "./query-sync";

const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
});
setupQuerySync(queryClient);

function QueryProvider(props: React.PropsWithChildren) {
	return <QueryClientProvider client={queryClient} {...props} />;
}

export { QueryProvider };
