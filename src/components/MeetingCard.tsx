import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, PlayIcon, ClockIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d");
  const formattedTime = format(new Date(interview.startTime), "h:mm a");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "live":
        return {
          variant: "default" as const,
          text: "Live Now",
          className: "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse glow-green"
        };
      case "upcoming":
        return {
          variant: "secondary" as const,
          text: "Upcoming",
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        };
      default:
        return {
          variant: "outline" as const,
          text: "Completed",
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card className="group glass liquid-hover border-0 overflow-hidden">
      {/* Animated background for live meetings */}
      {status === "live" && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <CardHeader className="space-y-4 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Date and time info */}
            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <Badge className={`${statusConfig.className} border-0 font-medium px-3 py-1`}>
            {statusConfig.text}
          </Badge>
        </div>

        {/* Meeting title */}
        <CardTitle className="text-xl group-hover:text-blue-500 transition-colors duration-300">
          {interview.title}
        </CardTitle>

        {/* Meeting description */}
        {interview.description && (
          <CardDescription className="line-clamp-2 leading-relaxed">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="relative">
        {status === "live" && (
          <Button 
            className="w-full glass-strong border-0 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition-all duration-300 ripple glow-green" 
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button 
            variant="outline" 
            className="w-full glass-subtle border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all duration-300" 
            disabled
          >
            <ClockIcon className="w-4 h-4 mr-2" />
            Waiting to Start
          </Button>
        )}

        {status === "completed" && (
          <div className="glass-subtle rounded-lg p-3 text-center">
            <span className="text-sm text-muted-foreground">Interview Completed</span>
          </div>
        )}

        {/* Bottom accent line for active meetings */}
        {status === "live" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;