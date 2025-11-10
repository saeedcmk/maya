import { getSessionOrThrowServer } from "@/features/auth/services/server/get-session-or-throw-server";

async function UserInfo() {
	const session = await getSessionOrThrowServer();

	return (
		<div className="space-y-1">
			<div>{session.nickname}</div>
			<div className="tracking-wide">{session.publicId}</div>
		</div>
	);
}

export { UserInfo };
