import { UTCDate } from "@date-fns/utc";
import type { Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { TZDate } from "react-day-picker";
import { withAuthApi } from "@/features/auth/utils/with-auth-api";
import { withSpaceFeatureApi } from "@/features/space-feature/utils/with-space-feature-api";
import { SpaceInvitationStatus } from "@/features/space-invitation/enums/space-invitation-status";
import type { SpaceInvitationCreateInput } from "@/features/space-invitation/models/space-invitation-create";
import { SpaceInvitationFindManyArgs } from "@/features/space-invitation/models/space-invitation-find-many";
import { SpaceMemberRole } from "@/features/space-member/enums/space-member-role";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/space/[spaceId]/invitation
const GET = withAuthApi(async (req, { user, params }) => {
	try {
		const { spaceId } = await params;

		const { searchParams } = req.nextUrl;

		const { where: whereQueryArg, ...queryArgs }: SpaceInvitationFindManyArgs =
			JSON.parse(searchParams.get("query") ?? "{}");

		const where: Prisma.SpaceInvitationWhereInput = {
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

// POST /api/space/[spaceId]/invitation
const POST = withAuthApi(
	withSpaceFeatureApi(async (req, { params, user, features }) => {
		try {
			const { spaceId } = await params;

			const input: SpaceInvitationCreateInput = await req.json();

			const normalizedPublicId = input.publicId.trim().toLowerCase();

			const [numOfActiveMembers, numOfPendingInvitations] = await Promise.all([
				prisma.spaceMember.count({
					where: {
						spaceId,
						status: SpaceMemberStatus.ACTIVE,
					},
				}),
				prisma.spaceInvitation.count({
					where: {
						spaceId,
						status: SpaceInvitationStatus.PENDING,
						expiresAt: { gt: new TZDate() },
					},
				}),
			]);

			if (
				features.max_space_members >=
				numOfActiveMembers + numOfPendingInvitations
			) {
				return failure("Maximum number of members exceeded");
			}

			// unable to use findUnique because of partial index
			const duplicateUser = await prisma.spaceMember.findFirst({
				where: {
					spaceId,
					user: { publicId: normalizedPublicId },
					status: SpaceMemberStatus.ACTIVE,
				},
			});

			if (duplicateUser) {
				return failure("User already in space", 403);
			}

			const expiresAt = addDays(new UTCDate(), 7);

			const data: Prisma.SpaceInvitationCreateInput = {
				space: {
					connect: {
						id: spaceId,
						OR: [
							{
								ownerId: user.id,
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
				userPublicId: normalizedPublicId,
				maxUses: 1,
				usesCount: 0,
				expiresAt,
				createdBy: { connect: { id: user.id } },
			};

			const createdInvitation = await prisma.spaceInvitation.create({
				data,
			});

			return success(
				createdInvitation,
				"Space invitation created successfully"
			);
		} catch (err) {
			console.error(err?.toString());
			return failure("Failed to create space invitation", 500);
		}
	})
);
export { GET, POST };
