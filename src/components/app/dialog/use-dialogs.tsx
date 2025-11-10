"use client";

import type { AbstractIntlMessages } from "next-intl";
import { useContext, useMemo } from "react";
import type { DialogProps } from "@/components/ui/dialog/dialog.types";
import { DialogsContext } from "./dialogs-context";

type DialogComponent<P, R> = React.ComponentType<DialogProps<P, R>>;

type DialogHook = {
	open: OpenDialog;
	close: CloseDialog;
};

type OpenDialog = {
	<P extends undefined, R>(
		Component: DialogComponent<P, R>,
		payload?: P,
		options?: OpenDialogOptions<R>
	): Promise<R>;

	<P, R>(
		Component: DialogComponent<P, R>,
		payload: P,
		options?: OpenDialogOptions<R>
	): Promise<R>;
};

type OpenDialogOptions<R> = {
	messages?: AbstractIntlMessages;
	onClose?: (result: R) => Promise<void>;
};

type CloseDialog = {
	<R>(dialog: Promise<R>, result: R): Promise<R>;
};

function useDialogs(): DialogHook {
	const context = useContext(DialogsContext);

	if (!context) {
		throw new Error("useDialogs must be used within a DialogsProvider.");
	}

	const { open, close } = context;

	return useMemo(
		() => ({
			open,
			close,
		}),
		[close, open]
	);
}

export type { CloseDialog, DialogComponent, OpenDialog, OpenDialogOptions };
export { useDialogs };
