import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { SpaceMemberRoleUpdateInput } from "@/features/space-member/models/space-member-role-update";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// PATCH /api/space/[spaceId]/member/[memberId]
const PATCH = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, memberId } = await params;

		const input: SpaceMemberRoleUpdateInput = await req.json();

		const member = await prisma.spaceMember.findUnique({
			where: { id: memberId, spaceId },
		});

		if (!member || member.status !== SpaceMemberStatus.ACTIVE) {
			return failure("Member is not found", 404);
		} else if (member.role === SpaceMemberRole.OWNER) {
			return failure("Owner role cannot be changed", 403);
		} else if (member.userId === user.id) {
			return failure("Own role cannot be changed", 403);
		}

		await prisma.spaceMember.update({
			where: {
				id: memberId,
				userId: { not: user.id },
				role: { not: SpaceMemberRole.OWNER },
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
			data: {
				role: input.role,
				updatedBy: { connect: { id: user.id } },
			},
		});

		return success(undefined, "Member role updated successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to update member role", 500);
	}
});

// DELETE /api/space/[spaceId]/member/[memberId]
const DELETE = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, memberId } = await params;

		const member = await prisma.spaceMember.findUnique({
			where: { id: memberId, spaceId },
		});

		if (!member) {
			return failure("Member is not found", 404);
		} else if (member.role === SpaceMemberRole.OWNER) {
			return failure("Owner cannot be removed", 403);
		}

		if (member.status === SpaceMemberStatus.REMOVED) {
			return success(undefined);
		}

		await prisma.spaceMember.update({
			where: {
				id: memberId,
				role: { not: SpaceMemberRole.OWNER },
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
			data: {
				status: SpaceMemberStatus.REMOVED,
				updatedBy: { connect: { id: user.id } },
			},
		});

		return success(undefined, "Member removed successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to remove member", 500);
	}
});

export { DELETE, PATCH };
