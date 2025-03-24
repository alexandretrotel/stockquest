import { Html, Text, Button } from "@react-email/components";

interface VerificationEmailProps {
  text: string;
  url: string;
}

export default function AuthEmail({ text, url }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Text className="text-center text-base text-black">{text}</Text>
      <Button
        href={url}
        className="mx-auto block rounded-md bg-black px-4 py-2 text-white"
      >
        Verify Email
      </Button>
    </Html>
  );
}
