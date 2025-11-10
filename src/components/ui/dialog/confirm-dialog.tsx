"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, type ButtonProps } from "../button";
import { Spinner } from "../spinner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog.internal";
import { type DialogProps } from "./dialog.types";

type ConfirmDialogPayload<T> = {
	title?: string;
	description?: string;
	submitText?: string;
	submitColor?: ButtonProps["color"];
	onSubmit: () => Promise<T>;
	onError?: (err: any) => void;
};

function ConfirmDialog<T = void>({
	payload,
	open,
	onClose,
}: DialogProps<ConfirmDialogPayload<T>, T>) {
	const t = useTranslations();

	const {
		title = t("confirm-dialog.title"),
		description = t("confirm-dialog.description"),
		submitText = t("exprs.delete"),
		submitColor = "destructive",
		onSubmit,
		onError,
	} = payload;

	const [isPending, setIsPending] = useState<boolean>(false);

	const handleSubmit = async () => {
		try {
			setIsPending(true);

			const result = await onSubmit();

			onClose(result);
		} catch (err) {
			onError?.(err);
		} finally {
			setIsPending(false);
		}
	};

	const spinnerColor = ["primary", "destructive"].includes(submitColor)
		? "white"
		: "primary";

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<DialogContent className="max-w-screen-xs max-xs:rounded-none">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						className="min-w-24"
						color={submitColor}
						disabled={isPending}
						type="button"
						onClick={handleSubmit}
					>
						<Spinner loading={isPending} color={spinnerColor} size="sm">
							{submitText}
						</Spinner>
					</Button>

					<DialogTrigger asChild>
						<Button disabled={isPending} type="button" variant="ghost">
							{t("exprs.cancel")}
						</Button>
					</DialogTrigger>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmDialog;
