import type { SpaceMemberRole } from "../enums/space-member-role";

type SpaceMemberCreateInput = {
	publicId: string;
	role: SpaceMemberRole;
};

export type { SpaceMemberCreateInput };
