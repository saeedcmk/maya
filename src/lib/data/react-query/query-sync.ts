import { QueryClient } from "@tanstack/react-query";

const channel = new BroadcastChannel("react-query");

type Message =
	| { type: "invalidate"; args: Parameters<QueryClient["invalidateQueries"]> }
	| { type: "reset"; queryKey: unknown[] };

function setupQuerySync(queryClient: QueryClient) {
	channel.onmessage = (event: MessageEvent<Message>) => {
		const { type } = event.data;

		if (type === "invalidate") {
			queryClient.invalidateQueries(...event.data.args);
		}

		if (type === "reset") {
			queryClient.resetQueries({ queryKey: event.data.queryKey });
		}
	};
}

function broadcastInvalidateQueries(
	...args: Parameters<QueryClient["invalidateQueries"]>
) {
	channel.postMessage({ type: "invalidate", args });
}

function broadcastResetQueries(queryKey: unknown[]) {
	channel.postMessage({ type: "reset", queryKey });
}

export { broadcastInvalidateQueries, broadcastResetQueries, setupQuerySync };
