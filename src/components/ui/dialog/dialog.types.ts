type DialogProps<P = undefined, R = void> = {
	payload: P;
	open: boolean;
	onClose: (result?: R) => Promise<void>;
};

export type { DialogProps };
