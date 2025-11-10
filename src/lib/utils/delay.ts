async function delay(ms?: number): Promise<void> {
	await new Promise((resolve) =>
		setTimeout(() => {
			resolve(null);
		}, ms)
	);
}

export { delay };
