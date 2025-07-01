import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handleJoin = async () => {
    await call.join();
    onSetupComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Enhanced Video Preview */}
          <Card className="border border-border/60 bg-gradient-surface rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Camera Preview
                </h1>
                <p className="text-muted-foreground">
                  Check your camera and audio settings before joining the interview
                </p>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60 border border-border/30 shadow-inner">
                <VideoPreview className="h-full w-full" />
              </div>
            </div>
          </Card>

          {/* Enhanced Controls */}
          <Card className="border border-border/60 bg-gradient-surface rounded-3xl shadow-xl">
            <div className="p-8 h-full flex flex-col">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Interview Setup
                </h2>
                <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Meeting ID</p>
                  <p className="text-sm font-mono text-foreground break-all bg-background/50 px-3 py-2 rounded-lg">
                    {call.id}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {/* Enhanced Camera Control */}
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                      <CameraIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Camera</p>
                      <p className="text-sm text-muted-foreground">
                        {isCameraDisabled ? "Disabled" : "Enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isCameraDisabled}
                    onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Enhanced Microphone Control */}
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center">
                      <MicIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Microphone</p>
                      <p className="text-sm text-muted-foreground">
                        {isMicDisabled ? "Disabled" : "Enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isMicDisabled}
                    onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                {/* Enhanced Device Settings */}
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center">
                      <SettingsIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Device Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Configure audio & video devices
                      </p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>

              {/* Enhanced Join Button */}
              <div className="space-y-4 mt-8">
                <Button 
                  className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 rounded-2xl" 
                  onClick={handleJoin}
                >
                  🚀 Join Interview
                </Button>
                <p className="text-sm text-center text-muted-foreground leading-relaxed">
                  Ready to showcase your skills? Take a deep breath and let's begin this journey together.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;