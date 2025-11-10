import type { SignUpInput } from "@/features/auth/models/signup";
import { hashPassword } from "@/features/auth/utils/hash-password";
import { hashUsername } from "@/features/auth/utils/hash-username";
import { generatePublicId } from "@/features/user/utils/generate-public-id";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

async function POST(req: Request) {
	try {
		const { username, password, nickname }: SignUpInput = await req.json();

		const normalizedNickname = nickname.trim();
		if (!normalizedNickname) {
			return failure("Nickname is required", 400, "VALIDATION_ERROR", {
				fields: {
					nickname: "required",
				},
			});
		}

		const normalizedUsername = username.trim();
		if (!normalizedUsername) {
			return failure("Username is required", 400, "VALIDATION_ERROR", {
				fields: {
					username: "required",
				},
			});
		}

		const normalizedPassword = password.trim();
		if (!normalizedPassword) {
			return failure("Password is required", 400, "VALIDATION_ERROR", {
				fields: {
					password: "required",
				},
			});
		}

		const hashedUsername = hashUsername(normalizedUsername);
		const hashedPassword = await hashPassword(normalizedPassword);

		let tries = 0;
		const maxTries = 5;

		while (tries < maxTries) {
			try {
				const publicId = generatePublicId();

				await prisma.user.create({
					data: {
						nickname: normalizedNickname,
						username: hashedUsername,
						password: hashedPassword,
						publicId,
					},
				});

				return success(undefined, "User created successfully");
			} catch (err: any) {
				if (err.code === "P2002" && err.meta?.target?.includes("public_id")) {
					tries++;
				} else {
					throw err;
				}
			}
		}

		return failure("Failed to generate unique publicId", 500);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to create user", 500);
	}
}

export { POST };
