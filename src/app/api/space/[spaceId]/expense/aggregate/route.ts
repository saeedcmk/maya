import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { ExpenseAggregateArgs } from "@/features/expense/models/expense-aggregate";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]/expense/aggregate
const GET = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: ExpenseAggregateArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

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

		const expenses = await prisma.expense.aggregate({
			where,
			...queryArgs,
		});

		return success(expenses);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve expenses", 500);
	}
});

export { GET };
