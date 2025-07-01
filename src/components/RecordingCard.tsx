import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      toast.success("Recording link copied");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy")
    : "Unknown";

  const formattedTime = recording.start_time
    ? format(new Date(recording.start_time), "h:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown";

  return (
    <Card className="border border-border hover:border-primary/20 transition-all duration-200">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {formattedStartTime}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {formattedTime}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Duration: {duration}
          </p>
        </div>
      </CardHeader>

      {/* Video Preview */}
      <CardContent className="pb-3">
        <div
          className="w-full aspect-video bg-muted/30 rounded-lg flex items-center justify-center cursor-pointer group border border-border/50 hover:border-primary/30 transition-all"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors shadow-sm">
            <PlayIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors ml-0.5" />
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-0 gap-2">
        <Button 
          size="sm" 
          className="flex-1 h-8 text-xs" 
          onClick={() => window.open(recording.url, "_blank")}
        >
          <PlayIcon className="w-3 h-3 mr-1" />
          Play
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={handleCopyLink}
        >
          <CopyIcon className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RecordingCard;