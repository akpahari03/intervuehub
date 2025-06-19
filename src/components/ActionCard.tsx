import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <Card
      className="group relative overflow-hidden glass liquid-hover cursor-pointer border-0"
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-20`} />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-blue" />

      {/* Content */}
      <div className="relative p-8 h-full">
        <div className="space-y-6">
          {/* Icon container */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl glass-subtle flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${
              action.color === 'primary' ? 'glow-blue' :
              action.color === 'purple-500' ? 'glow-emerald' :
              action.color === 'blue-500' ? 'glow-blue' : 'glow-orange'
            }`}>
              <action.icon className={`h-8 w-8 ${
                action.color === 'primary' ? 'text-blue-500' :
                action.color === 'purple-500' ? 'text-emerald-500' :
                action.color === 'blue-500' ? 'text-blue-500' : 'text-orange-500'
              } transition-all duration-500 group-hover:scale-110`} />
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
          </div>

          {/* Text content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xl group-hover:text-blue-500 transition-colors duration-300">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Card>
  );
}

export default ActionCard;