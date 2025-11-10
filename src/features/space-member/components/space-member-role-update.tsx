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
import { Spinner } from "@/components/ui/spinner";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { SpaceMemberRole } from "../enums/space-member-role";
import { updateSpaceMemberRole } from "../services/update-space-member-role";
import type { SpaceMember } from "../types/space-member";
import { SpaceMemberRoleSelect } from "./space-member-role-select";

function SpaceMemberRoleUpdateDialog({
	payload,
	open,
	onClose,
}: DialogProps<
	{ spaceId: string; member: Pick<SpaceMember, "id" | "role"> },
	boolean
>) {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const formSchema = useMemo(
		() =>
			z.object({
				role: z.enum([SpaceMemberRole.ADMIN, SpaceMemberRole.MEMBER], {
					message: t("errors.required"),
				}),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			role: undefined,
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: handleRoleUpdateMutation } = useMutation({
		mutationFn: (values: FormSchema) =>
			updateSpaceMemberRole(payload.member.id, payload.spaceId, {
				role: values.role,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", payload.spaceId, "root"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			await handleRoleUpdateMutation(values);
			onClose(true);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"space-member-role-update",
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
						<DialogTitle>{t("space-member-role-update.title")}</DialogTitle>
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
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("space-member.role")}</FormLabel>
										<FormControl>
											<SpaceMemberRoleSelect excludeOwner {...field} />
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
									{t("exprs.update")}
								</Spinner>
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Form>
		</Dialog>
	);
}

export default SpaceMemberRoleUpdateDialog;
