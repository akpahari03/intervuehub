import { LoaderIcon } from "lucide-react";

function LoaderUI() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 animate-pulse">
            <LoaderIcon className="h-8 w-8 animate-spin text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">Loading...</p>
          <p className="text-sm text-muted-foreground">Please wait while we prepare everything for you</p>
        </div>
      </div>
    </div>
  );
}

export default LoaderUI;