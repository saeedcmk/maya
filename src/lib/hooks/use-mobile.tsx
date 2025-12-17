"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
	const [isMobile, setIsMobile] = useState<boolean>();

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);

		const initialize = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		initialize();

		return () => mql.removeEventListener("change", onChange);
	}, []);

	return isMobile;
}

export { useIsMobile };
