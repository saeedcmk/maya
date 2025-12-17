"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DialogProps } from "@/components/ui/dialog/dialog.types";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCategoryOptions } from "@/features/category/hooks/use-category-options";
import { ExpenseListFilterArgs } from "./expense-list.types.internal";

const formSchema = z.object({
	title: z.string(),
	categoryId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type ExpenseListFilterDialogPayload = {
	spaceId: string;
	filterArgs: ExpenseListFilterArgs;
	setFilterArgs: (args: ExpenseListFilterArgs) => void;
};

function ExpenseListFilterDialog({
	payload,
	open,
	onClose,
}: DialogProps<ExpenseListFilterDialogPayload>) {
	const t = useTranslations();

	const { spaceId, filterArgs, setFilterArgs } = payload;

	const form = useForm<FormSchema>({
		defaultValues: {
			title: filterArgs.title ?? "",
			categoryId: filterArgs.categoryId ?? "",
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = form;

	function handleSubmit(values: FormSchema) {
		setFilterArgs(values);
		onClose();
	}

	const { data: categoryOptions, isFetching: isFetchingCategories } =
		useCategoryOptions(spaceId);

	const isLoading = isFetchingCategories;

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<Form {...form}>
				<DialogContent
					aria-describedby={undefined}
					className="max-w-screen-2xs"
				>
					<DialogHeader>
						<DialogTitle>{t("expense-list.filter-dialog.title")}</DialogTitle>
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
									<Spinner loading={isSubmitting} size="sm">
										{t("exprs.filter")}
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

export default ExpenseListFilterDialog;
