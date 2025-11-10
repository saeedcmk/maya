import { type AbstractIntlMessages, useMessages } from "next-intl";
import { getMessagesFromPath } from "../utils/get-messages-from-path";

function usePartialMessages(
	path: string | (string | { path: string; spread: boolean })[]
): AbstractIntlMessages {
	const messages = useMessages();
	return getMessagesFromPath(messages, path);
}

export { usePartialMessages };
