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
import { type Space } from "@/features/space/types/space";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { createSpaceInvitation } from "../services/create-space-invitation";

type SpaceInvitationCreateDialogPayload = { space: Space };

function SpaceInvitationCreateDialog({
	payload,
	open,
	onClose,
}: DialogProps<SpaceInvitationCreateDialogPayload, boolean>) {
	const { space } = payload;

	const t = useTranslations();

	const queryClient = useQueryClient();

	const formSchema = useMemo(
		() =>
			z.object({
				publicId: z.string().nonempty(t("errors.required")),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			publicId: "",
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: handleAddMutation } = useMutation({
		mutationFn: (values: FormSchema) =>
			createSpaceInvitation(space.id, {
				publicId: values.publicId,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", space.id, "invitations"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			await handleAddMutation(values);
			onClose(true);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"space-invitation-create",
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
						<DialogTitle>{t("space-invitation-create.title")}</DialogTitle>
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
								name="publicId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("space-invitation-create.fields.user_public_id.title")}
										</FormLabel>
										<FormControl>
											<Input {...field} />
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
									{t("exprs.create")}
								</Spinner>
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Form>
		</Dialog>
	);
}

export default SpaceInvitationCreateDialog;
