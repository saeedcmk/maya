import { SpaceMemberList } from "@/features/space-member/components/space-member-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function MembersPage() {
	const messages = await getPartialMessages([
		"features.space-member.components.space-member-list",
		"features.space-member.components.space-member-role-update",
	]);

	return (
		<I18nProvider messages={messages}>
			<SpaceMemberList />
		</I18nProvider>
	);
}

export default MembersPage;
