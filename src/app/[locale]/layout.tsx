import { Nunito, Vazirmatn } from "next/font/google";
import { getDirection } from "@/lib/i18n/utils/get-direction";
import { Providers } from "./providers";

const nunito = Nunito({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	style: "normal",
	display: "swap",
	fallback: [],
	adjustFontFallback: false,
	variable: "--font-nunito",
});

const vazirmatn = Vazirmatn({
	weight: ["400", "500", "600", "700"],
	subsets: ["arabic"],
	style: "normal",
	display: "swap",
	fallback: [],
	adjustFontFallback: false,
	variable: "--font-vazirmatn",
});

async function LocaleLayout({
	children,
	params,
}: React.PropsWithChildren<{
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	const { dir } = getDirection(locale);

	return (
		<html
			// data-theme="dark"
			className={`${nunito.variable} ${vazirmatn.variable}`}
			dir={dir}
			lang={locale}
		>
			<body className="text-xsm font-sans antialiased">
				<Providers locale={locale}>{children}</Providers>
			</body>
		</html>
	);
}

export default LocaleLayout;
