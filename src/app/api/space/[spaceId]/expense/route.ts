import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { ExpenseCreateInput } from "@/features/expense/models/expense-create";
import type { ExpenseFindManyArgs } from "@/features/expense/models/expense-find-many";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]/expense
const GET = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const { searchParams } = req.nextUrl;

		const {
			count: countQueryArg,
			where: whereQueryArg,
			...queryArgs
		}: ExpenseFindManyArgs = JSON.parse(searchParams.get("query") ?? "{}");

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

		const query = prisma.expense.findMany({
			where,
			...queryArgs,
		});

		if (countQueryArg) {
			const [data, count] = await prisma.$transaction([
				query,
				prisma.expense.count({ where }),
			]);

			return success({ data, count });
		}

		const expenses = await query;

		return success(expenses);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve expenses", 500);
	}
});

// POST /api/space/[spaceId]/expense
const POST = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const input: ExpenseCreateInput = await req.json();

		const normalizedTitle = input.title.trim();
		if (!normalizedTitle) {
			return failure("Title is required", 400, "VALIDATION_ERROR", {
				fields: {
					title: "required",
				},
			});
		}

		const normalizedAmount =
			typeof input.amount === "string"
				? Number(input.amount.trim())
				: input.amount;
		if (typeof input.amount === "string" && input.amount.trim() === "") {
			return failure("Amount is required", 400, "VALIDATION_ERROR", {
				fields: {
					amount: "required",
				},
			});
		} else if (!normalizedAmount && normalizedAmount !== 0) {
			return failure("Amount is required", 400, "VALIDATION_ERROR", {
				fields: {
					amount: "invalid",
				},
			});
		}

		const normalizedDate = input.date.trim();
		if (!normalizedDate) {
			return failure("Date is required", 400, "VALIDATION_ERROR", {
				fields: {
					amount: "required",
				},
			});
		}

		const data: Prisma.ExpenseCreateInput = {
			title: normalizedTitle,
			amount: normalizedAmount,
			date: new Date(normalizedDate),
			category: { connect: { id: input.categoryId } },
			paidBy: { connect: { id: user.id } },
			space: {
				connect: {
					id: spaceId,
					OR: [
						{ ownerId: user.id },
						{
							members: {
								some: {
									userId: user.id,
									status: SpaceMemberStatus.ACTIVE,
								},
							},
						},
					],
				},
			},
			createdBy: { connect: { id: user.id } },
			updatedBy: { connect: { id: user.id } },
		};

		const createdExpense = await prisma.expense.create({
			data,
		});

		return success(createdExpense, "Expense created successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to create expense", 500);
	}
});

export { GET, POST };
