import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="relative">
          <div className="glass rounded-full p-6 glow-blue">
            <LoaderIcon className="size-6 animate-spin text-blue-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500/50 animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-purple-500/50 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)] bg-gradient-to-br from-background via-background to-background/50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
          {/* VIDEO LAYOUT */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="glass-subtle h-full">
              {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
            </div>

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-2 top-2 bottom-20 w-[320px] glass rounded-xl border-0 overflow-hidden">
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-col items-center gap-4">
              {/* Main call controls */}
              <div className="glass-strong rounded-2xl p-3 border-0">
                <CallControls onLeave={() => router.push("/")} />
              </div>

              {/* Additional controls */}
              <div className="flex items-center gap-3">
                {/* Layout selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="size-12 glass-subtle border-0 liquid-hover glow-blue"
                    >
                      <LayoutListIcon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border-0 mb-2">
                    <DropdownMenuItem 
                      onClick={() => setLayout("grid")}
                      className="liquid-hover rounded-lg mx-1 focus:bg-white/10"
                    >
                      Grid View
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLayout("speaker")}
                      className="liquid-hover rounded-lg mx-1 focus:bg-white/10"
                    >
                      Speaker View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Participants toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 glass-subtle border-0 liquid-hover glow-purple"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <UsersIcon className="size-5" />
                </Button>

                {/* End call button */}
                <div className="glass-subtle rounded-xl p-1">
                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="glass-subtle border-0 w-1 mx-1 rounded-full" />

        <ResizablePanel defaultSize={65} minSize={25}>
          <div className="h-full glass-subtle rounded-2xl overflow-hidden ml-2">
            <CodeEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MeetingRoom;