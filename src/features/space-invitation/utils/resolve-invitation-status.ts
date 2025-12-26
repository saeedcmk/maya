import { UTCDate } from "@date-fns/utc";
import { SpaceInvitationStatus } from "../enums/space-invitation-status";
import { SpaceInvitation } from "../types/space-invitation";

function resolveInvitationStatus(
	invitation: Pick<SpaceInvitation, "status" | "expiresAt">
): SpaceInvitationStatus {
	if (invitation.status !== SpaceInvitationStatus.PENDING) {
		return invitation.status;
	}

	return invitation.expiresAt < new UTCDate().toISOString()
		? SpaceInvitationStatus.EXPIRED
		: SpaceInvitationStatus.PENDING;
}

export { resolveInvitationStatus };
