"use client";

import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { SpaceLayoutTabs } from "./space-layout-tabs";

function SpaceLayoutHeader() {
	const { space } = useSpaceContext();

	return (
		<div className="space-y-6">
			<div className="flex flex-row items-center justify-between gap-x-3 gap-y-6">
				<div className="text-smx cursor-default">{space.name}</div>
			</div>

			<SpaceLayoutTabs spaceId={space.id} />
		</div>
	);
}

export { SpaceLayoutHeader };
