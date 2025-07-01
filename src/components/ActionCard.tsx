import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <Card
      className="group relative overflow-hidden border border-border/60 hover:border-primary/30 transition-all duration-300 cursor-pointer bg-gradient-surface hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="p-8">
        <div className="flex flex-col space-y-6">
          {/* Icon with enhanced styling */}
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm">
              <action.icon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
              {action.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}

export default ActionCard;