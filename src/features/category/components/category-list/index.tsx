import { CategoryListProvider } from "./category-list-provider.internal";
import { CategoryListWidget } from "./category-list-widget.internal";

function CategoryList() {
	return (
		<CategoryListProvider>
			<CategoryListWidget />
		</CategoryListProvider>
	);
}

export { CategoryList };
