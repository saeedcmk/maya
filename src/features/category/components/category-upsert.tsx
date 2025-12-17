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
import type { Space } from "@/features/space/types/space";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { createCategory } from "../services/create-category";
import { updateCategory } from "../services/update-category";
import type { Category } from "../types/category";

type CategoryUpsertDialogPayload = { space: Space; category?: Category };

function CategoryUpsertDialog({
	payload: { space, category },
	open,
	onClose,
}: DialogProps<CategoryUpsertDialogPayload, Category | undefined>) {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const formSchema = useMemo(
		() =>
			z.object({
				title: z.string().nonempty(t("errors.required")),
				slug: z.string(),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			title: category?.title ?? "",
			slug: category?.slug ?? "",
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: mutateCategory } = useMutation({
		mutationFn: (values: FormSchema) =>
			category?.id
				? updateCategory(category.id, category.spaceId, {
						spaceId: space.id,
						title: values.title,
						slug: values.slug,
					})
				: createCategory(space.id, {
						title: values.title,
						slug: values.slug,
					}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", space.id, "categories"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			const upsertedCategory = await mutateCategory(values);

			onClose(upsertedCategory);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"category-upsert",
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
						<DialogTitle>
							{category?.id
								? t("category-upsert.title.update")
								: t("category-upsert.title.create")}
						</DialogTitle>
					</DialogHeader>

					<form
						className="grid gap-8"
						onSubmit={async (event) => {
							event.stopPropagation();
							await form.handleSubmit(handleSubmit)(event);
						}}
					>
						{errors.root?.message && (
							<Alert intent="danger">
								<AlertDescription>{errors.root.message}</AlertDescription>
							</Alert>
						)}

						<fieldset
							className="space-y-6"
							disabled={isSubmitting || isSubmitSuccessful}
						>
							<FormField
								control={control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("category.title")}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("category.slug")}</FormLabel>
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
									{category?.id ? t("exprs.update") : t("exprs.add")}
								</Spinner>
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Form>
		</Dialog>
	);
}

export default CategoryUpsertDialog;
