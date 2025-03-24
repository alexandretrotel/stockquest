"use client";

import { ArrowUpRight, Bell, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LEGAL, QUICKLINKS, RESSOURCES, SOCIALS } from "@/data/footer";
import { usePushNotificationsStore } from "@/stores/push-notification.store";
import { usePushNotification } from "@/hooks/use-push-notifications";

export default function Footer() {
  const { isSubscribed, isSupported } = usePushNotificationsStore();
  const { subscribeToPush, unsubscribeFromPush } = usePushNotification();

  return (
    <footer className="bg-background border-t pt-12 pb-8">
      <div className="mx-auto">
        <div className="container mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="text-game-primary flex items-center gap-2 text-lg font-bold">
              <TrendingUp size={20} />
              <span>StockQuest</span>
            </div>

            <p className="text-foreground">
              Gamified stock portfolio management platform to help you learn,
              invest, and grow your wealth.
            </p>

            <div className="flex space-x-4">
              {SOCIALS.map((item, index) => (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="hover:text-foreground text-muted-foreground transition-colors"
                >
                  <item.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {QUICKLINKS.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-game-primary text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-bold">Resources</h3>
            <ul className="space-y-2">
              {RESSOURCES.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    target="_blank"
                    className="hover:text-game-primary text-foreground flex items-center gap-1 transition-colors"
                  >
                    {item.title} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {isSupported && (
            <div>
              <h3 className="text-foreground mb-4 font-bold">
                Keep up with the latest news
              </h3>

              <div className="mt-4">
                {isSubscribed ? (
                  <Button
                    onClick={async () => await unsubscribeFromPush()}
                    className="game-button-gray"
                  >
                    Unsubscribe, and say goodbye
                  </Button>
                ) : (
                  <Button onClick={async () => await subscribeToPush()}>
                    <Bell size={20} />
                    Subscribe to Updates
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="container flex flex-col items-center justify-between md:flex-row">
            <p className="text-muted-foreground mb-4 text-sm md:mb-0">
              © 2025 StockQuest. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {LEGAL.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
