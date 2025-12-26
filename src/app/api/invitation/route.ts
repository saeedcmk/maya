import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
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

		return success(invitations);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve invitations", 500);
	}
});

export { GET };
