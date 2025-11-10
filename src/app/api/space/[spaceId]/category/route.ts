import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { CategoryCreateInput } from "@/features/category/models/category-create";
import type { CategoryFindManyArgs } from "@/features/category/models/category-find-many";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]/category
const GET = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: CategoryFindManyArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.CategoryWhereInput = {
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

		const categories = await prisma.category.findMany({
			where,
			...queryArgs,
		});

		return success(categories);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve categories", 500);
	}
});

// POST /api/space/[spaceId]/category
const POST = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const input: CategoryCreateInput = await req.json();

		const normalizedTitle = input.title.trim();
		if (!normalizedTitle) {
			return failure("Title is required", 400, "VALIDATION_ERROR", {
				fields: {
					title: "required",
				},
			});
		}

		const normalizedSlug =
			input.slug?.trim().toLowerCase() ||
			normalizedTitle.toLowerCase() ||
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
				spaceId_slug: { spaceId, slug: normalizedSlug },
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

		const data: Prisma.CategoryCreateInput = {
			title: normalizedTitle,
			slug: normalizedSlug,
			user: { connect: { id: user.id } },
			space: {
				connect: {
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
		};

		const createdCategory = await prisma.category.create({
			data,
		});

		return success(createdCategory, "Category created successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to create category", 500);
	}
});

export { GET, POST };
