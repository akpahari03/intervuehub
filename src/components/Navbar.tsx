import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { UserCheckIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DashboardBtn";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 dark:border-white/5">
      <div className="flex h-16 items-center px-6 container mx-auto">
        {/* LEFT SIDE - LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-2xl mr-8 font-mono liquid-hover group"
        >
          <div className="relative">
            <UserCheckIcon className="size-8 text-blue-500 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <div className="absolute inset-0 size-8 rounded-full bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="gradient-text font-bold tracking-tight">
            IntervueHub
          </span>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-3 ml-auto">
            <DasboardBtn />
            <div className="glass-subtle rounded-lg p-1">
              <ModeToggle />
            </div>
            <div className="glass-subtle rounded-full p-1 liquid-hover">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-white/20 dark:ring-white/10"
                  }
                }}
              />
            </div>
          </div>
        </SignedIn>
      </div>
      
      {/* Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </nav>
  );
}

export default Navbar;