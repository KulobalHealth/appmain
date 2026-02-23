"use client";

import { Wallet } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Profile from "@/components/auth/account-dropdown";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuthStore } from "@/store/auth-store";

export function SiteHeader() {
  const { isAuthenticated, user, getProfile } = useAuthStore();

  // Fetch profile only if authenticated and user data is not loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      getProfile();
    }
  }, [isAuthenticated, user, getProfile]);

  return (
    <header className="flex flex-1 sticky top-0 z-50 w-full items-center border-b bg-background py-3">
      <div className="flex h-(--header-height) w-full items-center justify-between px-4">
        <div className="flex items-center gap-2"></div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost">
            <Wallet className="mr-2 h-4 w-4" />
            Amount
          </Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
          {(isAuthenticated && user) && <Profile />}
        </div>
      </div>
    </header>
  );
}
