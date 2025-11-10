"use client";

import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type SelectOption } from "../select/select.types";
import {
	PaginationButton,
	PaginationContent,
	PaginationItem,
	PaginationRoot,
} from "./pagination.primitives";

type PaginationProps = {
	page: number;
	pageSize: number;
	pageSizeOptions?: SelectOption<number>[];
	count: number | undefined;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
};

function Pagination({ page, pageSize, count, onPageChange }: PaginationProps) {
	const t = useTranslations("pagination");

	if (!count) return;

	const pages = Math.ceil(count / pageSize);
	const offset = page * pageSize;

	const before = page > 0 ? offset : 0;
	const after = page >= 0 && page < pages - 1 ? pages - page : 0;

	return (
		<PaginationRoot className="justify-start px-6">
			<PaginationContent>
				<PaginationItem>
					<PaginationButton
						aria-label={t("previous.description")}
						className="gap-1 ps-2.5"
						disabled={!before}
						size="default"
						onClick={() => {
							onPageChange(page - 1);
						}}
					>
						<LucideChevronLeft className="size-4 rtl:rotate-180" />
						<span>{t("previous.title")}</span>
					</PaginationButton>
				</PaginationItem>

				<PaginationItem>
					<PaginationButton
						aria-label={t("next.description")}
						className="gap-1 pe-2.5"
						disabled={!after}
						size="default"
						onClick={() => {
							onPageChange(page + 1);
						}}
					>
						<span>{t("next.title")}</span>
						<LucideChevronRight className="size-4 rtl:rotate-180" />
					</PaginationButton>
				</PaginationItem>
			</PaginationContent>
		</PaginationRoot>
	);
}

export { Pagination };
