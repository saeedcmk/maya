import type { Prisma } from "@prisma/client";
import { TZDate } from "react-day-picker";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import { SpaceInvitationStatus } from "@/features/space-invitation/enums/space-invitation-status";
import type { SpaceInvitationFindManyArgs } from "@/features/space-invitation/models/space-invitation-find-many";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/invitation
const GET = withAuthApi(async (req, { user }) => {
	try {
		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: SpaceInvitationFindManyArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.SpaceInvitationWhereInput = {
			...(whereQueryArg ?? {}),
			userPublicId: user.publicId,
		};

		const invitations = await prisma.spaceInvitation.findMany({
			where,
			...queryArgs,
		});

		const expiredPendingInvitations = invitations.filter(
			(invitation) =>
				invitation.status === SpaceInvitationStatus.PENDING &&
				invitation.expiresAt > new TZDate()
		);

		if (expiredPendingInvitations.length) {
			await prisma.spaceInvitation.updateMany({
				where: {
					id: {
						in: expiredPendingInvitations.map((invitation) => invitation.id),
					},
				},
				data: { status: SpaceInvitationStatus.EXPIRED },
			});
		}

		return success(invitations);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve invitations", 500);
	}
});

export { GET };
