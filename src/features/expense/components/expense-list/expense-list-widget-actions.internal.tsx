"use client";

import {
	LucideDownload,
	LucideEllipsis,
	LucideFileText,
	LucideListFilter,
	LucidePlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardActions } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { downloadBlob } from "@/lib/utils/blob";
import { useExpenseListContext } from "./expense-list-context.internal";
import { ExpenseListWidgetMonthSelect } from "./expense-list-widget-month-select.internal";

function ExpenseListWidgetActions() {
	const t = useTranslations();

	const {
		isLoading,

		openFilterDialog,
		openReportDialog,
		openUpsertDialog,
	} = useExpenseListContext();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<CardActions>
			<Button
				color="primary"
				disabled={isLoading}
				type="button"
				onClick={openUpsertDialog.bind(null, undefined)}
			>
				<LucidePlus />
				<span>{t("expense-list.actions.create")}</span>
			</Button>

			<ExpenseListWidgetMonthSelect />

			<Button
				color="inverse"
				disabled={isLoading}
				type="button"
				variant="outline"
				onClick={openFilterDialog}
			>
				<LucideListFilter />
				<span>{t("exprs.filters")}</span>
			</Button>

			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button color="inverse" type="button" variant="outline">
						<LucideEllipsis />
						<span className="sr-only">Actions</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem
						disableCloseOnSelect
						onSelect={() => {
							openReportDialog();
							setTimeout(() => setIsOpen(false), 1000);
						}}
					>
						<LucideFileText />
						<span>{t("expense-list.actions.report")}</span>
					</DropdownMenuItem>

					<ExpenseListWidgetExportAction
						closeMenu={setIsOpen.bind(null, false)}
					/>
				</DropdownMenuContent>
			</DropdownMenu>
		</CardActions>
	);
}

function ExpenseListWidgetExportAction({
	closeMenu,
}: {
	closeMenu: () => void;
}) {
	const t = useTranslations();

	const { features } = useSpaceContext();

	const {
		exportManyOp: { mutateAsync, isPending },
	} = useExpenseListContext();

	return (
		<DropdownMenuItem
			disableCloseOnSelect
			disabled={isPending}
			onSelect={async () => {
				if (features.export_csv) {
					const blob = await mutateAsync();
					downloadBlob(blob, { filename: "data.xlsx" });
					closeMenu();
				} else {
					alert("You cannot export expenses");
				}
			}}
		>
			<Spinner loading={isPending} size="auto">
				<LucideDownload />
			</Spinner>
			<span>{t("expense-list.actions.export") || "Export"}</span>
		</DropdownMenuItem>
	);
}

export { ExpenseListWidgetActions };
