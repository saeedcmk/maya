"use client";

import { SpaceInvitationListProvider } from "./space-invitation-list-provider.internal";
import { SpaceInvitationListWidget } from "./space-invitation-list-widget.internal";

function SpaceInvitationList() {
	return (
		<SpaceInvitationListProvider>
			<SpaceInvitationListWidget />
		</SpaceInvitationListProvider>
	);
}

export { SpaceInvitationList };
