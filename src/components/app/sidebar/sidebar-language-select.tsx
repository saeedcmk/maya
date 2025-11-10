"use client";

import { LucideCheck, LucideChevronsUpDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Flag from "react-flagkit";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { LANGUAGES } from "@/lib/i18n/i18n-consts";
import { usePathname, useRouter } from "@/lib/i18n/i18n-navigation";
import { Locale } from "@/lib/i18n/types/locale";
import { getObjectEntries } from "@/lib/utils/object";

function SidebarLanguageSelect() {
	const router = useRouter();
	const pathname = usePathname();

	const t = useTranslations();
	const currentLocale = useLocale();

	const { isMobile } = useSidebar();

	const currentLanguage = LANGUAGES[currentLocale as Locale];

	function handleSelect(locale: string) {
		if (locale !== currentLocale) {
			router.push(pathname, { locale });
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<Flag
						country={currentLanguage.flag}
						style={{ width: 24, height: "auto", borderRadius: 4 }}
					/>
					<div className="flex grow items-center">
						<span>{currentLanguage.label}</span>
						<LucideChevronsUpDown className="ms-auto size-4" />
					</div>
				</SidebarMenuButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
				side={isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={currentLocale}
					onValueChange={(value) => handleSelect(value)}
				>
					{getObjectEntries(LANGUAGES).map(([locale, { flag, label }]) => (
						<DropdownMenuRadioItem
							key={locale}
							className="cursor-pointer"
							indicator={<LucideCheck className="size-4" />}
							value={locale}
						>
							<div className="flex gap-3">
								<Flag
									country={flag}
									style={{ width: 24, height: "auto", borderRadius: 4 }}
								/>
								<span>{label}</span>
							</div>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { SidebarLanguageSelect };
