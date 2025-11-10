import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { CategoryUpdateInput } from "@/features/category/models/category-update";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// PATCH /api/space/[spaceId]/category/[categoryId]
const PATCH = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, categoryId } = await params;

		const input: CategoryUpdateInput = await req.json();

		const data: Prisma.CategoryUpdateInput = {};

		let normalizedTitle: string | undefined;
		if (typeof input.title !== "undefined") {
			normalizedTitle = input.title.trim();
			data.title = normalizedTitle;
		}

		if (typeof input.slug !== "undefined") {
			const normalizedSlug =
				input.slug.trim().toLowerCase() ||
				normalizedTitle?.toLowerCase() ||
				undefined;

			if (!normalizedSlug) {
				return failure("Slug is required", 400, "VALIDATION_ERROR", {
					fields: {
						slug: "invalid",
					},
				});
			}

			const dupBySlug = await prisma.category.findUnique({
				where: {
					NOT: { id: categoryId },
					spaceId_slug: {
						spaceId: input.spaceId,
						slug: normalizedSlug,
					},
				},
			});

			if (dupBySlug) {
				return failure("Slug already exists", 400, "VALIDATION_ERROR", {
					fields: {
						slug: {
							type: "common",
							code: "duplicate",
							payload: { value: normalizedSlug },
						},
					},
				});
			}

			data.slug = normalizedSlug;
		}

		const updatedCategory = await prisma.category.update({
			where: {
				id: categoryId,
				space: {
					id: spaceId,
					OR: [
						{ ownerId: user.id },
						{
							members: {
								some: {
									userId: user.id,
									role: { in: [SpaceMemberRole.OWNER, SpaceMemberRole.ADMIN] },
									status: SpaceMemberStatus.ACTIVE,
								},
							},
						},
					],
				},
			},
			data,
		});

		return success(updatedCategory, "Category updated successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to update category", 500);
	}
});

// DELETE /api/space/[spaceId]/category/[categoryId]
const DELETE = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, categoryId } = await params;

		const body: { fallbackId?: string } = await req.json();

		const expensesCount = await prisma.category
			.findUnique({
				where: {
					id: categoryId,
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
				select: { _count: { select: { expenses: true } } },
			})
			.then((response) => response?._count.expenses);
		if (expensesCount && !body.fallbackId) {
			return failure("Dependent expenses exist", 400, "DEPENDENCY_ERROR", {
				dependents: {
					expenses: expensesCount,
				},
			});
		}

		await prisma.$transaction([
			prisma.expense.updateMany({
				where: {
					categoryId,
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
				data: { categoryId: body.fallbackId },
			}),
			prisma.category.delete({
				where: {
					id: categoryId,
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
			}),
		]);

		return success(undefined, "Category deleted successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to delete category", 500);
	}
});

export { DELETE, PATCH };
