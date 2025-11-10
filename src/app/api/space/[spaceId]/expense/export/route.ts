import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import * as XLSX from "xlsx";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { ExpenseExportArgs } from "@/features/expense/models/expense-export";
import { withSpaceFeatureApi } from "@/features/space-feature/utils/with-space-feature-api";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure } from "@/lib/data/api/api-response";
import { DEFAULT_LOCALE } from "@/lib/i18n/i18n-consts";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]/expense/export
const GET = withAuthApi(
	withSpaceFeatureApi(async (req, { params, user }) => {
		try {
			const { spaceId } = await params;

			const { searchParams } = req.nextUrl;

			const {
				locale = DEFAULT_LOCALE,
				where: whereQueryArg,
				...queryArgs
			}: ExpenseExportArgs = JSON.parse(searchParams.get("query") ?? "{}");

			const t = await getTranslations({ locale });

			const where: Prisma.ExpenseWhereInput = {
				...(whereQueryArg ?? {}),
				space: {
					...((whereQueryArg?.space ?? {}) as Prisma.SpaceWhereInput),
					id: spaceId,
					AND: [
						{
							OR: [
								{ ownerId: user.id },
								{
									members: {
										some: { userId: user.id, status: SpaceMemberStatus.ACTIVE },
									},
								},
							],
						},
						{
							AND: [
								...(!!whereQueryArg?.space?.AND
									? Array.isArray(whereQueryArg.space.AND)
										? whereQueryArg.space.AND
										: [whereQueryArg.space.AND]
									: []),
							],
						},
					],
				},
			};

			const expenses = await prisma.expense.findMany({
				where,
				include: { category: true },
				...queryArgs,
			});

			const worksheet = XLSX.utils.aoa_to_sheet([
				[
					t("features.expense.types.expense.title"),
					t("features.expense.types.expense.category"),
					t("features.expense.types.expense.date"),
					t("features.expense.types.expense.amount"),
				],
				...expenses.map((expense) => [
					expense.title,
					expense.category.title,
					expense.date,
					expense.amount.toNumber(),
				]),
			]);

			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

			return new NextResponse(buffer, {
				status: 200,
				headers: {
					"Content-Type":
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					"Content-Disposition": `attachment; filename="expenses.xlsx"`,
				},
			});
		} catch (err) {
			console.error(err?.toString());
			return failure("Failed to export expenses", 500);
		}
	})
);

export { GET };
