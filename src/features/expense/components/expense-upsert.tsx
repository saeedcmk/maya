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
import { DateInput } from "@/components/ui/input/date-input";
import { PriceInput } from "@/components/ui/input/price-input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCategoryOptions } from "@/features/category/hooks/use-category-options";
import type { Space } from "@/features/space/types/space";
import { isApiFailureResponse } from "@/lib/data/api/api-response";
import { useDateUtils } from "@/lib/i18n/hooks/use-date-utils";
import { createExpense } from "../services/create-expense";
import { updateExpense } from "../services/update-expense";
import type { Expense } from "../types/expense";

type ExpenseUpsertDialogPayload = { space: Space; expense?: Expense };

function ExpenseUpsertDialog({
	payload: { space, expense },
	open,
	onClose,
}: DialogProps<ExpenseUpsertDialogPayload, Expense | undefined>) {
	const t = useTranslations();
	const { parseLocaleDate, formatLocaleDate, formatGregorianDateInUTC } =
		useDateUtils();

	const queryClient = useQueryClient();

	const formSchema = useMemo(
		() =>
			z.object({
				title: z.string().nonempty(t("errors.required")),
				date: z.string().nonempty(t("errors.required")),
				amount: z.string().nonempty(t("errors.required")),
				categoryId: z.string().nonempty(t("errors.required")),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			title: expense?.title ?? "",
			date: expense?.date ? formatLocaleDate(expense.date) : "",
			amount: expense?.amount.toString() ?? "",
			categoryId: expense?.categoryId ?? "",
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: handleUpsertMutation } = useMutation({
		mutationFn: (values: FormSchema) => {
			const date = formatGregorianDateInUTC(parseLocaleDate(values.date));

			return expense?.id
				? updateExpense(expense.id, expense.spaceId, {
						title: values.title,
						date,
						amount: values.amount,
						categoryId: values.categoryId,
					})
				: createExpense(space.id, {
						title: values.title,
						date,
						amount: values.amount,
						categoryId: values.categoryId,
					});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["spaces", space.id, "expenses"],
			});
		},
	});

	async function handleSubmit(values: FormSchema) {
		try {
			const upsertedExpense = await handleUpsertMutation(values);
			onClose(upsertedExpense);
		} catch (err) {
			if (isApiFailureResponse(err)) {
				const formErrors = getLocalizedFormErrors(
					t,
					"expense-upsert",
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
		useCategoryOptions(space.id);

	const isLoading = isFetchingCategories;

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<Form {...form}>
				<DialogContent
					aria-describedby={undefined}
					className="max-w-screen-2xs max-2xs:rounded-none"
					onOpenAutoFocus={(event) => event.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>
							{expense?.id
								? t("expense-upsert.title.update")
								: t("expense-upsert.title.create")}
						</DialogTitle>
					</DialogHeader>

					<Spinner loading={isLoading}>
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
											<FormLabel>{t("expense.title")}</FormLabel>
											<FormControl>
												<Input autoFocus {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="date"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("expense.date")}</FormLabel>
											<FormControl>
												<DateInput
													calendar={{
														closeOnSelect: true,
														disabled: (date) => date > new Date(),
													}}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="amount"
									render={({ field: { ...field } }) => (
										<FormItem>
											<FormLabel>{t("expense.amount")}</FormLabel>
											<FormControl>
												<PriceInput {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("expense.category")}</FormLabel>
											<FormControl>
												<Select options={categoryOptions} {...field} />
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
										{expense?.id ? t("exprs.update") : t("exprs.add")}
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

export default ExpenseUpsertDialog;
