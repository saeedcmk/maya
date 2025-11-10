import "./globals.css";
import { type Metadata } from "next";

const metadata: Metadata = {
	title: "Maya",
	description: "",
};

function RootLayout({ children }: React.PropsWithChildren) {
	return children;
}

export { metadata };
export default RootLayout;
