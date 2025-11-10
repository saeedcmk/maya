"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { login } from "../services/login";

function LoginForm({ debug = false }: { debug?: boolean }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const t = useTranslations();

	const formSchema = useMemo(
		() =>
			z.object({
				username: z.string().nonempty(t("errors.required")),
				password: z.string().nonempty(t("errors.required")),
			}),
		[t]
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		defaultValues: {
			username: "",
			password: "",
		},
		resolver: zodResolver(formSchema),
	});

	const {
		control,
		formState: { errors, isSubmitting, isSubmitSuccessful },
		setError,
	} = form;

	const { mutateAsync: loginMutate } = useMutation({
		mutationFn: (values: FormSchema) =>
			login({ username: values.username, password: values.password }),
	});

	async function handleSubmit(values: FormSchema) {
		try {
			await loginMutate(values);

			const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
			router.push(callbackUrl);
		} catch {
			setError("root", { message: t("errors.unknown") });
		}
	}

	const [signUpLink, setSignUpLink] = useState<string>("/auth/signup");

	useEffect(() => {
		setSignUpLink(`/auth/signup${document?.location.search}`);
	}, []);

	return (
		<Form {...form}>
			<Card className="max-xs:min-h-svh xs:mx-8 xs:w-96 xs:rounded-2xl flex w-full items-center justify-center rounded-none shadow-2xl">
				<CardContent className="w-full">
					<form
						className="space-y-8"
						onSubmit={form.handleSubmit(handleSubmit)}
					>
						{errors.root?.message && (
							<Alert variant="destructive">
								<AlertDescription>{errors.root.message}</AlertDescription>
							</Alert>
						)}

						<fieldset
							className="space-y-6"
							disabled={isSubmitting || isSubmitSuccessful}
						>
							<FormField
								control={control}
								name="username"
								render={({ field }) => (
									<FormItem className="max-xs:max-w-80 mx-auto">
										<FormLabel>
											{t("login-form.fields.username.title")}
										</FormLabel>
										<FormControl>
											<Input className="rtl:text-right" dir="ltr" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="password"
								render={({ field }) => (
									<FormItem className="max-xs:max-w-80 mx-auto">
										<FormLabel>
											{t("login-form.fields.password.title")}
										</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</fieldset>

						<div className="max-xs:max-w-80 mx-auto space-y-4">
							<div className="space-y-2">
								<Button
									className="w-full"
									disabled={isSubmitting || isSubmitSuccessful}
									variant="contained"
								>
									<Spinner
										color="white"
										loading={isSubmitting || isSubmitSuccessful}
										size="sm"
									>
										{t("login-form.actions.login")}
									</Spinner>
								</Button>
							</div>

							{debug && (
								<p className="text-center">
									{t("login-form.actions.no_account.description")}{" "}
									<Link href={signUpLink} prefetch={false}>
										{t("login-form.actions.no_account.link")}
									</Link>
								</p>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</Form>
	);
}

export { LoginForm };
