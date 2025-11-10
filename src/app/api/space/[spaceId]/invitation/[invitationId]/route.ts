import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import { SpaceInvitationStatus } from "@/features/space-invitation/enums/space-invitation-status";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// DELETE /api/space/[spaceId]/invitation/[invitationId]
const DELETE = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId, invitationId } = await params;

		const invitation = await prisma.spaceInvitation.findUnique({
			where: { id: invitationId, spaceId },
		});

		if (!invitation) {
			return failure("Invitation is not found", 404);
		} else if (invitation.status !== SpaceInvitationStatus.PENDING) {
			return failure("Invitation can only be deleted when in pending state");
		}

		await prisma.spaceInvitation.delete({
			where: {
				id: invitationId,
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
		});

		return success(undefined, "Invitation deleted successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to delete invitation", 500);
	}
});

export { DELETE };
