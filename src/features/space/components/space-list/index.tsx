"use client";

import { SpaceListProvider } from "./space-list-provider.internal";
import { SpaceListWidget } from "./space-list-widget.internal";

function SpaceList() {
	return (
		<SpaceListProvider>
			<SpaceListWidget />
		</SpaceListProvider>
	);
}

export { SpaceList };
