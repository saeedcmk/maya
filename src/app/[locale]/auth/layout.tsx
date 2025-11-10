function AuthLayout(props: React.PropsWithChildren) {
	return (
		<div
			className="xs:py-10 flex min-h-svh flex-1 items-center justify-center"
			{...props}
		/>
	);
}

export default AuthLayout;
