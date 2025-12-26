import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import { SpaceInvitationStatus } from "@/features/space-invitation/enums/space-invitation-status";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// POST /api/invitation/[invitationId]
const POST = withAuthApi(async (req, { user, params }) => {
	try {
		const { invitationId } = await params;

		const input: { status: SpaceInvitationStatus } = await req.json();

		const allowedStatuses: SpaceInvitationStatus[] = [
			SpaceInvitationStatus.ACCEPTED,
			SpaceInvitationStatus.DECLINED,
		];
		if (!allowedStatuses.includes(input.status)) {
			return failure("Status is invalid", 400, "VALIDATION_ERROR");
		}

		const invitation = await prisma.spaceInvitation.findUnique({
			where: { id: invitationId, userPublicId: user.publicId },
		});
		if (!invitation) {
			return failure("Invitation is not found", 404);
		} else if (invitation.status === SpaceInvitationStatus.EXPIRED) {
			return failure("Invitation is expired", 403);
		} else if (invitation.status !== SpaceInvitationStatus.PENDING) {
			return failure("Invitation isn't in pending state", 403);
		}

		if (input.status === SpaceInvitationStatus.DECLINED) {
			await prisma.spaceInvitation.update({
				where: {
					id: invitationId,
					userPublicId: user.publicId,
					status: SpaceInvitationStatus.PENDING,
				},
				data: {
					status: SpaceInvitationStatus.DECLINED,
					resolvedAt: new Date(),
				},
			});

			return success(undefined, "Invitation declined successfully");
		}

		await prisma.$transaction([
			prisma.spaceInvitation.update({
				where: {
					id: invitationId,
					status: SpaceInvitationStatus.PENDING,
					userPublicId: user.publicId,
				},
				data: {
					status: SpaceInvitationStatus.ACCEPTED,
					usesCount: invitation.usesCount + 1,
					resolvedAt: new Date(),
				},
			}),
			prisma.spaceMember.create({
				data: {
					space: { connect: { id: invitation.spaceId } },
					user: { connect: { publicId: invitation.userPublicId! } },
					role: SpaceMemberRole.MEMBER,
					invitation: { connect: { id: invitation.id } },
					updatedBy: { connect: { id: user.id } },
				},
			}),
		]);

		return success(undefined, "Invitation accepted successfully");
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to update invitation", 500);
	}
});

export { POST };
