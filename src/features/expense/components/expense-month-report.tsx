"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { DialogProps } from "@/components/ui/dialog/dialog.types";
import { Spinner } from "@/components/ui/spinner";
import { useDateUtils } from "@/lib/i18n/hooks/use-date-utils";
import { useLanguage } from "@/lib/i18n/hooks/use-language";
import type { ExpenseAggregateArgs } from "../models/expense-aggregate";
import { aggregateExpense } from "../services/aggregate-expense";

type ExpenseMonthReportPayload = {
	spaceId: string;
	period: { year: number; month: number };
	startDate: Date;
	endDate: Date;
};

function ExpenseMonthReportDialog({
	payload,
	open,
	onClose,
}: DialogProps<ExpenseMonthReportPayload>) {
	const { spaceId, period, startDate, endDate } = payload;

	const t = useTranslations();
	const { intl } = useLanguage();
	const { getMonthName, newDate, asUTC, getDifferenceInDays } = useDateUtils();

	const monthName = useMemo(
		() => getMonthName(period.month),
		[period.month, getMonthName]
	);

	const queryArgs = {
		where: {
			AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
		},
		_sum: {
			amount: true,
		},
	} satisfies ExpenseAggregateArgs;

	const { data, isFetching, error } = useQuery({
		queryKey: ["spaces", spaceId, "expenses", queryArgs],
		queryFn: () => aggregateExpense(spaceId, queryArgs),
		placeholderData: keepPreviousData,
	});

	const avgEndDate = useMemo(() => {
		const today = asUTC(newDate({}));

		if (today < startDate || today > endDate) {
			return endDate;
		}

		return today;
	}, [startDate, endDate, newDate, asUTC]);

	const total = (data?._sum.amount as number) || 0;
	const dailyAvg = total
		? Math.floor(total / (getDifferenceInDays(avgEndDate, startDate) + 1))
		: 0;

	return (
		<Dialog open={open} onOpenChange={onClose.bind(null, undefined)}>
			<DialogContent
				aria-describedby={undefined}
				className="max-w-screen-2xs max-2xs:rounded-none"
			>
				<DialogHeader>
					<DialogTitle>
						{t("expense-month-report.title", { monthName })}
					</DialogTitle>
				</DialogHeader>

				{error && (
					<Alert intent="danger">
						<AlertDescription>
							{error.message || t("errors.unknown")}
						</AlertDescription>
					</Alert>
				)}

				{!error && (
					<Spinner loading={isFetching}>
						<div className="xs:flex-row flex flex-col gap-6">
							<div className="space-y-1">
								<div className="text-muted-foreground">
									{t("expense-month-report.fields.total.title")}
								</div>
								<div>{new Intl.NumberFormat(intl).format(total)}</div>
							</div>

							<div className="space-y-1">
								<div className="text-muted-foreground">
									{t("expense-month-report.fields.daily_avg.title")}
								</div>
								<div>{new Intl.NumberFormat(intl).format(dailyAvg)}</div>
							</div>
						</div>
					</Spinner>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ExpenseMonthReportDialog;
