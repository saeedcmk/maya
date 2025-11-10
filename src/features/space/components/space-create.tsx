"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { DialogProps } from "@/components/ui/dialog/dialog.types";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { getLocalizedFormErrors } from "@/components/ui/form/form.utils";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { invalidateQueriesAndBroadcast } from "@/lib/data/react-query/utils/invalidate-queries-and-broadcast";
import type { SpaceType } from "../enums/space-type";
import { createSpace } from "../services/create-space";
import type { Space } from "../types/space";
import { SpaceTypeSelect } from "./space-type-select";

function SpaceCreateDialog({
	payload,
	open,
	onClose,
}: DialogProps<Partial<{ type: SpaceType }> | undefined, Space>) {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const formSchema = useMemo(
		() =>
			z.object({
				name: z.string().nonempty(t("errors.required")),
				type: z.custom<SpaceType>(Boolean, t("errors.required")),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			name: "",
			type: payload?.type ?? undefined,
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: handleCreateMutation } = useMutation({
		mutationFn: (values: FormSchema) =>
			createSpace({
				name: values.name,
				type: values.type,
			}),
		onSuccess: () => {
			invalidateQueriesAndBroadcast(queryClient, {
				queryKey: ["spaces", "root"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			const createdSpace = await handleCreateMutation(values);
			onClose(createdSpace);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"space-create",
					err,
					values
				);

				if (formErrors) {
					formErrors.forEach(({ fieldName, fieldMessage }) =>
						setError(fieldName, {
							message: fieldMessage,
						})
					);
					return;
				}
			}

			setError("root", {
				message: t("errors.unknown"),
			});
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<Form {...form}>
				<DialogContent
					aria-describedby={undefined}
					className="max-w-screen-2xs max-2xs:rounded-none"
				>
					<DialogHeader>
						<DialogTitle>{t("space-create.title")}</DialogTitle>
					</DialogHeader>

					<form
						className="grid gap-8"
						onSubmit={async (event) => {
							event.stopPropagation();
							await form.handleSubmit(handleSubmit)(event);
						}}
					>
						{errors.root?.message && (
							<Alert variant="destructive">
								<AlertDescription>{errors.root.message}</AlertDescription>
							</Alert>
						)}

						<fieldset
							className="space-y-6"
							disabled={isSubmitting || isSubmitSuccessful}
						>
							<FormField
								control={control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("space.name")}</FormLabel>
										<FormControl>
											<Input autoFocus {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("space.type")}</FormLabel>
										<FormControl>
											<SpaceTypeSelect {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</fieldset>

						<DialogFooter>
							<Button
								className="min-w-24"
								color="primary"
								disabled={isSubmitting || isSubmitSuccessful}
								type="submit"
							>
								<Spinner color="white" loading={isSubmitting} size="sm">
									{t("exprs.add")}
								</Spinner>
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Form>
		</Dialog>
	);
}

export default SpaceCreateDialog;
