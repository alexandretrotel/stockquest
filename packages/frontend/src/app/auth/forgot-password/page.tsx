"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EmailLinks from "@/features/auth/components/email-redirection";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ResetFormData = {
  email: string;
};

export default function ResetPasswordPage() {
  const [sentEmail, setSentEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>();
  const router = useRouter();

  const onSubmit = async (data: ResetFormData) => {
    const { email } = data;
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
    });

    if (error) {
      toast.error("An error occurred. Please try again.");
    }

    setSentEmail(true);
    toast.success("Reset link sent to your email.");
  };

  return (
    <div className="relative mx-auto flex h-screen flex-col justify-center">
      <div className="absolute top-0 left-0 p-4">
        <Button variant="outline" onClick={() => router.push("/auth/signin")}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-xl font-bold">Reset Your Password</h1>

        {sentEmail ? (
          <EmailLinks left />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex w-full flex-col space-y-4"
          >
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-game-accent">{errors.email.message}</p>
            )}

            <Button variant="outline" type="submit">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
