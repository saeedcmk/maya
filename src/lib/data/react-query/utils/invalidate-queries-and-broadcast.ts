import type { QueryClient } from "@tanstack/react-query";
import { broadcastInvalidateQueries } from "../query-sync";

function invalidateQueriesAndBroadcast(
	queryClient: QueryClient,
	...args: Parameters<QueryClient["invalidateQueries"]>
) {
	queryClient.invalidateQueries(...args);
	broadcastInvalidateQueries(...args);
}

export { invalidateQueriesAndBroadcast };
