import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon, VideoIcon } from "lucide-react";
import { Button } from "./ui/button";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown duration";

  return (
    <Card className="group glass liquid-hover border-0 overflow-hidden">
      {/* Status indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 to-blue-500/50" />
      
      {/* CARD HEADER */}
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="glass-subtle rounded-full p-2 glow-green">
            <VideoIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground bg-green-500/10 px-2 py-1 rounded-full">
            Recording
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formattedStartTime}</span>
            </div>
            <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* CARD CONTENT - Video Preview */}
      <CardContent className="p-6 pt-0">
        <div
          className="relative w-full aspect-video glass-subtle rounded-xl flex items-center justify-center cursor-pointer group/video overflow-hidden"
          onClick={() => window.open(recording.url, "_blank")}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-green-500/10 opacity-0 group-hover/video:opacity-100 transition-opacity duration-500" />
          
          {/* Play button */}
          <div className="relative z-10 glass rounded-full p-4 group-hover/video:scale-110 transition-all duration-300 glow-blue">
            <PlayIcon className="size-8 text-blue-500 group-hover/video:text-blue-400 transition-colors" />
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-4 right-4 opacity-0 group-hover/video:opacity-100 transition-opacity duration-500">
            <div className="glass-subtle rounded-full p-2">
              <VideoIcon className="h-4 w-4 text-green-500" />
            </div>
          </div>
          
          {/* Duration overlay */}
          <div className="absolute bottom-4 left-4 glass-subtle rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
            {duration}
          </div>
        </div>
      </CardContent>

      {/* CARD FOOTER - Action Buttons */}
      <CardFooter className="p-6 pt-0 gap-3">
        <Button 
          className="flex-1 glass-subtle border-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-300 ripple glow-blue" 
          onClick={() => window.open(recording.url, "_blank")}
        >
          <PlayIcon className="size-4 mr-2" />
          Play Recording
        </Button>
        
        <Button 
          className="glass-subtle border-0 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all duration-300 liquid-hover"
          onClick={handleCopyLink}
        >
          <CopyIcon className="size-4" />
        </Button>
      </CardFooter>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}

export default RecordingCard;