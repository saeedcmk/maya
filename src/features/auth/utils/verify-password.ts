import bcrypt from "bcrypt";

async function verifyPassword(a: string, b: string): Promise<boolean> {
	return await bcrypt.compare(a, b);
}

export { verifyPassword };
