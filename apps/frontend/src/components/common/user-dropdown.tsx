"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Monitor,
  Bot,
  Check,
  Bookmark,
  Award,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAIProviderStore } from "@/stores/ai.store";
import AIProviderDialog from "../../features/ai/components/api-key-dialog";
import Link from "next/link";
import { DEFAULT_AUTH_REDIRECT_PAGE } from "@/data/settings";
import { AI_PROVIDERS } from "@/data/ai";

interface ThemeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export default function UserDropdown() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const { aiProvider, setAIProvider, getProviderName } = useAIProviderStore();

  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);

  const themeOptions: ThemeOption[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const userInitials =
    session?.user?.name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() ?? "A";

  return (
    <>
      <DropdownMenu>
        {session ? (
          <DropdownMenuTrigger asChild>
            <button className="relative flex items-center justify-center rounded-full">
              <Avatar>
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt="User"
                  className="hover:opacity-80"
                />
                <AvatarFallback className="bg-primary text-primary-foreground hover:opacity-80">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
        ) : (
          <Link
            href={DEFAULT_AUTH_REDIRECT_PAGE}
            className="relative flex items-center justify-center rounded-full"
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground hover:opacity-80">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        {session && (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {session.user.name ?? "N/A"}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {session.user.isAnonymous
                    ? "anon@stockq.app"
                    : (session.user.email ?? "N/A")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {!session.user.isAnonymous && (
                <DropdownMenuItem
                  className="text-foreground"
                  onClick={() => router.push("/profile")}
                >
                  <User className="text-foreground" size={20} />
                  <span>My Profile</span>
                </DropdownMenuItem>
              )}

              {!!session?.user?.isAnonymous && (
                <DropdownMenuItem
                  className="text-foreground"
                  onClick={() => router.push("/auth/signup")}
                >
                  <User className="text-foreground" size={20} />
                  <span>Create Account</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-foreground"
                onClick={() => router.push("/saved-portfolios")}
              >
                <Bookmark className="text-foreground" size={20} />
                <span>Saved Portfolios</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-foreground"
                onClick={() => router.push("/achievements")}
              >
                <Award className="text-foreground" size={20} />
                <span>Achievements</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Bot className="mr-2" size={20} />
                  <span>AI Provider</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {AI_PROVIDERS.map((providerItem) => (
                      <DropdownMenuItem
                        key={providerItem.provider}
                        onClick={() => setAIProvider(providerItem.provider)}
                        className="text-foreground"
                      >
                        {getProviderName(providerItem.provider)}
                        {aiProvider === providerItem.provider && (
                          <Check className="ml-auto" size={20} />
                        )}
                      </DropdownMenuItem>
                    ))}

                    {AI_PROVIDERS.find(
                      ({ provider }) => provider === aiProvider,
                    )?.needsApiKey && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setApiKeyDialogOpen(true)}
                        >
                          <Settings className="text-foreground" size={20} />
                          <span>Configure API Key</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun
                    size={20}
                    className="mr-2 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
                  />
                  <Moon
                    size={20}
                    className="absolute mr-2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
                  />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {themeOptions.map((theme) => (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => setTheme(theme.value)}
                      >
                        <theme.icon className="text-foreground" size={20} />
                        <span>{theme.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="text-foreground" size={20} />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                router.push(DEFAULT_AUTH_REDIRECT_PAGE);
              }}
            >
              <LogOut className="text-foreground" size={20} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <AIProviderDialog
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
      />
    </>
  );
}
