"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Create", href: "/post/create" },
  ];
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-xl">
            Next.js 16 Blog
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((navItem) => (
              <Link
                href={navItem.href}
                key={navItem.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                )}
              >
                {navItem.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">{/* search placeholder */}</div>
          {/* placeholder for theme toggle */}
          <div className="flex items-center gap-2">
            <Button variant={"default"} asChild>
              <Link href={"auth"}>Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
