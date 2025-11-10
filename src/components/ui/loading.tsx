import { useTranslations } from "next-intl";
import { Spinner, SpinnerProps } from "./spinner";

type LoadingProps = Omit<SpinnerProps, "color" | "label">;

function Loading(props: LoadingProps) {
	const t = useTranslations("loading");

	return <Spinner {...props} color="primary" label={t("label")} />;
}

export { Loading };
