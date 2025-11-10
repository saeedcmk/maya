import crypto from "crypto";

function hashUsername(username: string): string {
	return crypto.createHash("sha256").update(username).digest("hex");
}

export { hashUsername };
