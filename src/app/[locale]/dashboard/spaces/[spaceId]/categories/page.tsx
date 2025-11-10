import { CategoryList } from "@/features/category/components/category-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function CategoriesPage() {
	const messages = await getPartialMessages([
		"features.category.components.category-list",
		"features.category.components.category-upsert",
		"features.category.components.category-delete",
	]);

	return (
		<I18nProvider messages={messages}>
			<CategoryList />
		</I18nProvider>
	);
}

export default CategoriesPage;
