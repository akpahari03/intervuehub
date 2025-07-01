import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "MMM d");
  const formattedTime = format(new Date(interview.startTime), "h:mm a");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500 text-white shadow-lg shadow-green-500/25 animate-pulse";
      case "upcoming":
        return "bg-blue-500 text-white shadow-lg shadow-blue-500/25";
      default:
        return "bg-gray-500 text-white shadow-lg shadow-gray-500/25";
    }
  };

  return (
    <Card className="group border border-border/60 hover:border-primary/40 transition-all duration-300 bg-gradient-surface hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
              <ClockIcon className="h-3.5 w-3.5" />
              {formattedTime}
            </div>
          </div>

          <Badge className={`px-3 py-1.5 text-xs font-semibold border-0 rounded-full ${getStatusStyle(status)}`}>
            {status === "live" ? "🔴 Live" : status === "upcoming" ? "⏰ Upcoming" : "✅ Done"}
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {interview.title}
        </CardTitle>

        {interview.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {status === "live" && (
          <Button 
            size="sm" 
            className="w-full h-10 text-sm font-semibold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-xl" 
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            🚀 Join Now
          </Button>
        )}

        {status === "upcoming" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-10 text-sm font-medium rounded-xl border-border/60 hover:border-primary/40 transition-all duration-200" 
            disabled
          >
            ⏳ Scheduled
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;