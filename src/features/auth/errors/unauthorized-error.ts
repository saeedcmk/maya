class UnauthorizedError extends Error {
	constructor(message = "Unauthorized") {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = "UnauthorizedError";
	}
}

export { UnauthorizedError };
