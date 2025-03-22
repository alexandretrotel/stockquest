import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmailLinksProps {
  left?: boolean;
}

export default function EmailRedirection({ left }: EmailLinksProps) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-wrap items-center gap-4",
        !left && "justify-center",
      )}
    >
      <Button variant="outline" asChild>
        <Link target="_blank" href="https://mail.google.com/mail/u/0/#inbox">
          Open Gmail
          <ArrowUpRight size={16} />
        </Link>
      </Button>

      <Button variant="outline" asChild>
        <Link target="_blank" href="https://mail.yahoo.com/">
          Open Yahoo Mail
          <ArrowUpRight size={16} />
        </Link>
      </Button>

      <Button variant="outline" asChild>
        <Link target="_blank" href="https://mail.protonmail.com/inbox">
          Open ProtonMail
          <ArrowUpRight size={16} />
        </Link>
      </Button>
    </div>
  );
}
