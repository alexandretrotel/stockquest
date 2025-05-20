"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MINIMUM_PASSWORD_LENGTH } from "@/data/settings";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ResetPasswordData = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const [token, setToken] = React.useState<string | null>(null);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordData>();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast.error("Invalid reset link. Please try again.");
    }
    setToken(token);
  }, []);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error("Invalid reset link. Please try again.");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token,
    });

    if (error) {
      toast.error("Failed to reset password");
      return;
    } else {
      toast.success("Password reset successfully");
    }

    router.push("/auth/signin");
  };

  const newPassword = watch("newPassword");

  return (
    <div className="relative mx-auto flex h-screen flex-col justify-center">
      <div className="absolute top-0 left-0 p-4">
        <Button variant="outline" onClick={() => router.push("/auth/signin")}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-bold">Reset Your Password</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 w-full space-y-4"
        >
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: MINIMUM_PASSWORD_LENGTH,
                message: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`,
              },
            })}
          />
          {errors.newPassword && (
            <p className="text-game-accent">{errors.newPassword.message}</p>
          )}

          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords don't match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-game-accent">{errors.confirmPassword.message}</p>
          )}

          <Button variant="outline" type="submit">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
