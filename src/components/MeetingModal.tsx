import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/useMeetingActions";
import { VideoIcon, LinkIcon } from "lucide-react";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const { createInstantMeeting, joinMeeting } = useMeetingActions();

  const handleStart = () => {
    if (isJoinMeeting) {
      // if it's a full URL extract meeting ID
      const meetingId = meetingUrl.split("/").pop();
      if (meetingId) joinMeeting(meetingId);
    } else {
      createInstantMeeting();
    }

    setMeetingUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass border-0 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />
        
        <div className="relative">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="glass-subtle rounded-full p-3 glow-blue">
                {isJoinMeeting ? (
                  <LinkIcon className="w-6 h-6 text-blue-500" />
                ) : (
                  <VideoIcon className="w-6 h-6 text-blue-500" />
                )}
              </div>
            </div>
            <DialogTitle className="text-center text-2xl gradient-text">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-6">
            {isJoinMeeting && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Meeting Link
                </label>
                <Input
                  placeholder="Paste meeting link here..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="glass-subtle border-0 hover:bg-white/10 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStart} 
                disabled={isJoinMeeting && !meetingUrl.trim()}
                className="glass-strong border-0 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ripple glow-blue"
              >
                {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingModal;