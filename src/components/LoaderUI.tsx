import { LoaderIcon } from "lucide-react";

function LoaderUI() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
        
        {/* Glass container */}
        <div className="relative glass rounded-full p-6 glow-blue">
          <LoaderIcon className="h-8 w-8 animate-spin text-blue-500" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-blue-500/50 animate-ping" />
        <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-0 left-0 w-1 h-1 rounded-full bg-green-500/50 animate-ping" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}

export default LoaderUI;