"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface InfoPopupProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  delayDuration?: number;
}

export function InfoPopup({
  trigger,
  content,
  side = "top",
  align = "center",
  className,
  delayDuration = 200,
}: InfoPopupProps) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  if (isDesktop) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={delayDuration}>
          <TooltipTrigger className="cursor-help" asChild>
            {trigger}
          </TooltipTrigger>
          <TooltipContent
            side={side}
            align={align}
            className={cn("max-w-xs", className)}
          >
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-help" asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn("max-w-xs", className)}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
