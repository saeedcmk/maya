"use client";

import { SpaceMemberListProvider } from "./space-member-list-provider.internal";
import { SpaceMemberListWidget } from "./space-member-list-widget.internal";

function SpaceMemberList() {
	return (
		<SpaceMemberListProvider>
			<SpaceMemberListWidget />
		</SpaceMemberListProvider>
	);
}

export { SpaceMemberList };
