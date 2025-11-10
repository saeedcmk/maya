import { useContext } from "react";

function useContextCreator<T>(context: React.Context<T | null>): T {
	const value = useContext(context);

	if (!value) {
		throw new Error();
	}

	return value;
}

export { useContextCreator };
