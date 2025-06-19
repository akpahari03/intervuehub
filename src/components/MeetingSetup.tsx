import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon, VideoIcon } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl float-delayed" />
      
      <div className="w-full max-w-[1200px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VIDEO PREVIEW SECTION */}
          <Card className="glass border-0 p-8 liquid-hover">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="glass-subtle rounded-full p-3 w-fit mx-auto glow-blue">
                  <VideoIcon className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Camera Preview</h2>
                <p className="text-sm text-muted-foreground">Make sure you look perfect!</p>
              </div>

              {/* VIDEO PREVIEW CONTAINER */}
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-subtle border-0">
                <VideoPreview className="h-full w-full" />
                
                {/* Camera status overlay */}
                <div className="absolute top-4 left-4">
                  <div className={`glass-subtle rounded-full px-3 py-1 text-xs font-medium ${
                    isCameraDisabled ? 'text-red-400' : 'text-green-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full inline-block mr-2 ${
                      isCameraDisabled ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    {isCameraDisabled ? 'Camera Off' : 'Camera On'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CONTROLS SECTION */}
          <Card className="glass border-0 p-8">
            <div className="h-full flex flex-col justify-between space-y-8">
              {/* MEETING DETAILS */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="glass-subtle rounded-full p-3 w-fit mx-auto glow-purple">
                    <SettingsIcon className="w-6 h-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">Meeting Setup</h2>
                  <p className="text-sm text-muted-foreground font-mono break-all bg-muted/20 rounded-lg px-3 py-2">
                    {call.id}
                  </p>
                </div>

                {/* DEVICE CONTROLS */}
                <div className="space-y-6">
                  {/* CAMERA CONTROL */}
                  <div className="glass-subtle rounded-xl p-4 liquid-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="glass rounded-full p-3 glow-blue">
                          <CameraIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Camera</p>
                          <p className="text-sm text-muted-foreground">
                            {isCameraDisabled ? "Currently disabled" : "Currently enabled"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={!isCameraDisabled}
                        onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  </div>

                  {/* MICROPHONE CONTROL */}
                  <div className="glass-subtle rounded-xl p-4 liquid-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="glass rounded-full p-3 glow-green">
                          <MicIcon className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Microphone</p>
                          <p className="text-sm text-muted-foreground">
                            {isMicDisabled ? "Currently muted" : "Currently active"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={!isMicDisabled}
                        onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>

                  {/* DEVICE SETTINGS */}
                  <div className="glass-subtle rounded-xl p-4 liquid-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="glass rounded-full p-3 glow-purple">
                          <SettingsIcon className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">Device Settings</p>
                          <p className="text-sm text-muted-foreground">Configure audio & video</p>
                        </div>
                      </div>
                      <div className="glass-subtle rounded-lg">
                        <DeviceSettings />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* JOIN BUTTON SECTION */}
              <div className="space-y-4">
                <Button 
                  className="w-full glass-strong border-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-400 hover:text-blue-300 transition-all duration-500 ripple glow-blue h-14 text-lg font-medium" 
                  onClick={handleJoin}
                >
                  <VideoIcon className="w-5 h-5 mr-2" />
                  Join Meeting
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    🎉 Ready to showcase your skills? Our team believes in you!
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">Connection secured</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;