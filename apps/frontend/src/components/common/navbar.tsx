"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";
import Search from "./search";
import UserDropdown from "./user-dropdown";
import { NAV_ITEMS } from "@/data/header";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:gap-8">
          <div className="hidden items-center gap-8 whitespace-nowrap md:flex">
            <Link href="/" className="items-center">
              <div className="text-game-primary flex items-center gap-2 text-lg font-bold">
                <TrendingUp size={20} />
                <span>StockQuest</span>
              </div>
            </Link>

            <nav className="flex md:gap-4">
              {NAV_ITEMS.map((item) => {
                if (item.disabled) {
                  return (
                    <button
                      key={item.href}
                      disabled
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                        pathname === item.href
                          ? "bg-game-primary/10 text-game-primary"
                          : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                      } cursor-not-allowed opacity-50`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                      pathname === item.href
                        ? "bg-game-primary/10 text-game-primary"
                        : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                    } ${item.disabled ? "!cursor-not-allowed opacity-50" : ""}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Search />

          <div className="hidden md:flex md:items-center md:gap-4">
            <UserDropdown />
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <UserDropdown />
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 pb-6 md:hidden">
            <div className="space-y-4">
              {NAV_ITEMS.map((item) => {
                if (item.disabled) {
                  return (
                    <button
                      key={item.href}
                      disabled
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                        pathname === item.href
                          ? "bg-game-primary/10 text-game-primary"
                          : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                      } cursor-not-allowed opacity-50`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                      pathname === item.href
                        ? "bg-game-primary/10 text-game-primary"
                        : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
