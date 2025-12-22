import type { Prisma } from "@prisma/client";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import type { SpaceInvitationCountArgs } from "@/features/space-invitation/models/space-invitation-count";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/invitation/count
const GET = withAuthApi(async (req, { user }) => {
	try {
		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: SpaceInvitationCountArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.SpaceInvitationWhereInput = {
			...(whereQueryArg ?? {}),
			userPublicId: user.publicId,
		};

		const count = await prisma.spaceInvitation.count({
			where,
			...queryArgs,
		});

		return success(count);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve invitations count", 500);
	}
});

export { GET };
