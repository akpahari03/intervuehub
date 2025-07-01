import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DashboardBtn";

function Navbar() {
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-xl hover:opacity-80 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-200">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            InterviewHub
          </span>
        </Link>

        {/* Actions */}
        <SignedIn>
          <div className="flex items-center gap-4">
            <DasboardBtn />
            <ModeToggle />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
                  userButtonPopoverCard: "shadow-xl border rounded-2xl",
                  userButtonPopoverFooter: "hidden"
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;