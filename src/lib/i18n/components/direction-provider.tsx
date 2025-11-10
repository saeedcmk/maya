"use client";

import { Direction } from "radix-ui";
import { DirectionContext } from "../contexts/direction-context";
import { getDirection } from "../utils/get-direction";

function DirectionProvider({
	locale,
	...props
}: React.PropsWithChildren<{ locale: string }>) {
	const value = getDirection(locale);

	return (
		<Direction.Provider dir={value.dir}>
			<DirectionContext value={value} {...props} />
		</Direction.Provider>
	);
}

export { DirectionProvider };
