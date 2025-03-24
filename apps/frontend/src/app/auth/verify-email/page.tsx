"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { toast } from "sonner";
import EmailLinks from "../../../features/auth/components/email-redirection";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    toast.error("You need to login first.");
    router.push("/auth/signin");
    return;
  }

  const email = session.user.email;

  const handleSendMail = async () => {
    setLoading(true);

    try {
      await authClient.sendVerificationEmail({
        email: email!,
        callbackURL: "/auth/signin",
      });
      setEmailSent(true);
      toast.success("Verification email sent.");
    } catch {
      toast.error("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="animate-pulse text-3xl font-bold">Verify your email</h1>
      <p className="text-muted-foreground mt-2 text-center">
        We have sent you an email with a link to verify your email address.
      </p>

      {emailSent ? (
        <EmailLinks />
      ) : (
        <Button
          variant="outline"
          onClick={async () => await handleSendMail()}
          className="mt-4"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {loading ? "Sending..." : "Send verification email"}
        </Button>
      )}
    </div>
  );
}
