import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { SpaceFindUniqueArgs } from "@/features/space/models/space-find-unique";
import type { SpaceUpdateInput } from "@/features/space/models/space-update";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]
const GET = withAuthApi(async (req, { user }) => {
	try {
		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: SpaceFindUniqueArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.SpaceWhereUniqueInput = {
			...(whereQueryArg ?? {}),
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
					AND: whereQueryArg?.AND,
				},
			],
		};

		const space = await prisma.space.findUniqueOrThrow({
			where,
			...queryArgs,
		});

		return success(space, "Space retrieved successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve space", 500);
	}
});

// PATCH /api/space/[spaceId]
const PATCH = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const input: SpaceUpdateInput = await req.json();

		const data: Prisma.SpaceUpdateInput = {};

		let normalizedName: string | undefined;
		if (typeof input.name !== "undefined") {
			normalizedName = input.name.trim();
			data.name = normalizedName;
		}

		const updatedSpace = await prisma.space.update({
			where: {
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
			data,
		});

		return success(updatedSpace, "Space updated successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to update space", 500);
	}
});

// DELETE /api/space/[id]
const DELETE = withAuthApi(async (req, { user, params }) => {
	try {
		const { id } = await params;

		await prisma.space.delete({
			where: {
				id,
				ownerId: user.id,
			},
		});

		return success(undefined, "Space deleted successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to delete space", 500);
	}
});

export { DELETE, GET, PATCH };
