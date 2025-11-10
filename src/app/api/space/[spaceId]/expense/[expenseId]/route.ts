import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { ExpenseUpdateInput } from "@/features/expense/models/expense-update";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// PATCH /api/space/[spaceId]/expense/[expenseId]
const PATCH = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, expenseId } = await params;

		const input: ExpenseUpdateInput = await req.json();

		const data: Prisma.ExpenseUpdateInput = {
			category: { connect: { id: input.categoryId } },
			updatedBy: { connect: { id: user.id } },
		};

		let normalizedTitle: string | undefined;
		if (typeof input.title !== "undefined") {
			normalizedTitle = input.title.trim();
			data.title = normalizedTitle;
		}

		if (typeof input.amount !== "undefined") {
			data.amount =
				(typeof input.amount === "string"
					? Number(input.amount.trim())
					: input.amount) || 0;
		}

		if (typeof input.date !== "undefined") {
			data.date = new Date(input.date.trim());
		}

		const updatedExpense = await prisma.expense.update({
			where: {
				id: expenseId,
				OR: [
					{
						createdById: user.id,
						space: {
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
					{
						createdById: { not: user.id },
						space: {
							id: spaceId,
							OR: [
								{ ownerId: user.id },
								{
									members: {
										some: {
											userId: user.id,
											role: {
												in: [SpaceMemberRole.OWNER, SpaceMemberRole.ADMIN],
											},
											status: SpaceMemberStatus.ACTIVE,
										},
									},
								},
							],
						},
					},
				],
			},
			data,
		});

		return success(updatedExpense, "Expense updated successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to update expense", 500);
	}
});

// DELETE /api/space/[spaceId]/expense/[expenseId]
const DELETE = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, expenseId } = await params;

		await prisma.expense.delete({
			where: {
				id: expenseId,
				OR: [
					{
						createdById: user.id,
						space: {
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
					{
						createdById: { not: user.id },
						space: {
							id: spaceId,
							OR: [
								{ ownerId: user.id },
								{
									members: {
										some: {
											userId: user.id,
											role: {
												in: [SpaceMemberRole.OWNER, SpaceMemberRole.ADMIN],
											},
											status: SpaceMemberStatus.ACTIVE,
										},
									},
								},
							],
						},
					},
				],
			},
		});

		return success(undefined, "Expense deleted successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to delete expense", 500);
	}
});

export { DELETE, PATCH };
