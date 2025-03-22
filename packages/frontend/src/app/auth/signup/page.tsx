"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ghost, Key } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MAXIMUM_PASSWORD_LENGTH,
  MAXIMUM_USERNAME_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
  PASSKEY_ENABLED,
} from "@/data/settings";
import { RiGoogleFill } from "@remixicon/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(MINIMUM_USERNAME_LENGTH, "Username is too short")
    .max(MAXIMUM_USERNAME_LENGTH, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z
    .string()
    .min(MINIMUM_PASSWORD_LENGTH, "Password is too short")
    .max(MAXIMUM_PASSWORD_LENGTH, "Password is too long"),
  confirmPassword: z.string(),
  email: z.string().email(),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.username,
      username: data.username,
      displayUsername: data.username,
      callbackURL: "/",
    });

    if (error) {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push("/auth/signin");
  };

  const handlePasskeySignup = async (data: SignUpFormData) => {
    const username = data.username;

    if (!username) {
      toast.error("Please enter a username first");
      return;
    }

    if (
      username.length < MINIMUM_USERNAME_LENGTH ||
      username.length > MAXIMUM_USERNAME_LENGTH
    ) {
      toast.error("Username must be between 5 and 30 characters");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authClient.passkey.addPasskey({
        name: username,
      });

      if (data?.error) {
        toast.error("An error occurred during passkey registration.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push("/");
    } catch {
      toast.error("An error occurred during passkey registration.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
      });

      router.push("/");
    } catch {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleAnonymousSignUp = async () => {
    setIsLoading(true);

    try {
      await authClient.signIn.anonymous();

      toast.success(
        "You are now signed in as a guest. However, your progress will not be saved.",
      );
      router.push("/");
    } catch {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-6">
          <div className="text-center">
            <h1 className="text-foreground text-2xl font-bold">
              Join StockQuest
            </h1>

            <p className="text-muted-foreground mt-2 text-sm">
              Create an account to start your investment journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••••••••••"
                {...register("password")}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-foreground font-medium"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="•••••••••••••••"
                {...register("confirmPassword")}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground bg-card px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {PASSKEY_ENABLED && (
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleSubmit(handlePasskeySignup)}
                  className="w-full"
                >
                  <Key className="h-4 w-4" />
                  {isLoading ? "Registering Passkey..." : "Use Passkey"}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={handleGoogleSignUp}
              >
                <RiGoogleFill className="h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign Up with Google"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={handleAnonymousSignUp}
              >
                <Ghost className="h-4 w-4" />
                {isLoading ? "Signing in..." : "Continue as Guest"}
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                type="button"
                className="text-game-blue font-semibold hover:underline"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
