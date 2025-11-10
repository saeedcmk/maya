import { SpaceMemberRole } from "../../space-member/enums/space-member-role";
import type { Space } from "../types/space";

function isSpaceOwnerOrAdmin(
	space: Pick<Space, "ownerId" | "members">,
	userId: string | undefined
): boolean {
	if (!userId) return false;

	return (
		space.ownerId === userId ||
		!!space.members?.some(
			(member) =>
				member.userId === userId &&
				(member.role === SpaceMemberRole.OWNER ||
					member.role === SpaceMemberRole.ADMIN)
		)
	);
}

export { isSpaceOwnerOrAdmin };
