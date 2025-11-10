import type { AbstractIntlMessages } from "next-intl";
import { getMessages } from "next-intl/server";
import { getMessagesFromPath } from "./get-messages-from-path";

async function getPartialMessages(
	path: string | (string | { path: string; spread: boolean })[]
): Promise<AbstractIntlMessages> {
	const messages = await getMessages();
	return getMessagesFromPath(messages, path);
}

export { getPartialMessages };
