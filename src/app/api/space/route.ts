import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { SpaceCreateInput } from "@/features/space/models/space-create";
import type { SpaceFindManyArgs } from "@/features/space/models/space-find-many";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space
const GET = withAuthApi(async (req, { user }) => {
	try {
		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: SpaceFindManyArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.SpaceWhereInput = {
			...(whereQueryArg ?? {}),
			OR: [
				{ ownerId: user.id },
				{
					members: {
						some: { userId: user.id, status: SpaceMemberStatus.ACTIVE },
					},
				},
			],
		};

		const spaces = await prisma.space.findMany({
			where,
			...queryArgs,
		});

		return success(spaces);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve spaces", 500);
	}
});

// POST /api/space
const POST = withAuthApi(async (req, { user }) => {
	try {
		const input: SpaceCreateInput = await req.json();

		const normalizedName = input.name.trim();
		if (!normalizedName) {
			return failure("Name is required", 400, "VALIDATION_ERROR", {
				fields: {
					title: "required",
				},
			});
		}

		const data: Prisma.SpaceCreateInput = {
			name: normalizedName,
			type: input.type,
			owner: { connect: { id: user.id } },
			members: {
				create: {
					user: { connect: { id: user.id } },
					role: SpaceMemberRole.OWNER,
					updatedBy: { connect: { id: user.id } },
				},
			},
		};

		const createdSpace = await prisma.space.create({
			data,
		});

		return success(createdSpace, "Space created successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to create space", 500);
	}
});

export { GET, POST };
