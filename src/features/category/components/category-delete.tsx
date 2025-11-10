"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { useCategoryOptions } from "../hooks/use-category-options";
import { countCategoryExpenses } from "../services/count-category-expenses";
import { deleteCategory } from "../services/delete-category";
import type { Category } from "../types/category";

function CategoryDeleteDialog({
	payload,
	open,
	onClose,
}: DialogProps<{ category: Category }, boolean>) {
	const { category } = payload;

	const t = useTranslations();

	const queryClient = useQueryClient();

	const { data: expenseCount, isFetching: isFetchingExpenseCount } = useQuery({
		queryKey: [
			category.spaceId,
			"expenses",
			{ categoryId: category.id },
			"count",
		],
		queryFn: async () =>
			await countCategoryExpenses(category.spaceId, category.id),
	});

	const formSchema = useMemo(
		() =>
			z.object({
				categoryId: z
					.string()
					.refine((value) => value || !expenseCount, t("errors.required")),
			}),
		[t, expenseCount]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			categoryId: "",
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
			deleteCategory(category.id, category.spaceId, values.categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", category.spaceId, "categories"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			await mutateCategory(values);

			onClose(true);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"category-delete",
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

	const { data: categoryOptions, isFetching: isFetchingCategories } =
		useCategoryOptions(category.spaceId, {
			where: { id: { not: category.id } },
		});

	const isLoading = isFetchingExpenseCount || isFetchingCategories;

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<Form {...form}>
				<DialogContent
					aria-describedby={undefined}
					className="max-w-screen-2xs max-2xs:rounded-none"
				>
					<DialogHeader>
						<DialogTitle>{t("category-delete.title")}</DialogTitle>
					</DialogHeader>

					<Spinner loading={isLoading}>
						<form
							className="grid gap-8"
							onSubmit={async (event) => {
								event.stopPropagation();
								await form.handleSubmit(handleSubmit)(event);
							}}
						>
							<fieldset
								className="space-y-6"
								disabled={isSubmitting || isSubmitSuccessful}
							>
								<p>
									{t(
										`category-delete.description.${expenseCount ? "with" : "without"}_expenses`,
										{
											title: category.title,
										}
									)}
								</p>

								{!!expenseCount && (
									<FormField
										control={control}
										name="categoryId"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="sr-only">
													{t("category-delete.fields.category.title")}
												</FormLabel>
												<FormControl>
													<Select options={categoryOptions} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</fieldset>

							{errors.root?.message && (
								<Alert variant="destructive">
									<AlertDescription>{errors.root.message}</AlertDescription>
								</Alert>
							)}

							<DialogFooter>
								<Button
									className="min-w-24"
									color="destructive"
									disabled={isSubmitting || isSubmitSuccessful}
									type="submit"
								>
									<Spinner color="white" loading={isSubmitting} size="sm">
										{t("exprs.delete")}
									</Spinner>
								</Button>
							</DialogFooter>
						</form>
					</Spinner>
				</DialogContent>
			</Form>
		</Dialog>
	);
}

export default CategoryDeleteDialog;
