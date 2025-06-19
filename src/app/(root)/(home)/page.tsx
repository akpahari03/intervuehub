"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";

export default function Home() {
  const router = useRouter();

  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-12">
      {/* WELCOME SECTION */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl float-delayed" />
        
        <div className="relative glass-strong rounded-3xl p-8 md:p-12 border-gradient">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="glass-subtle rounded-full p-3 glow-blue">
                <SparklesIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
              Welcome back!
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isInterviewer
                ? "Orchestrate seamless interviews and discover exceptional talent with our liquid-smooth platform"
                : "Step into your next opportunity with confidence and clarity"}
            </p>
          </div>
        </div>
      </div>

      {isInterviewer ? (
        <>
          {/* QUICK ACTIONS GRID */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Quick Actions</h2>
              <p className="text-muted-foreground">Everything you need at your fingertips</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {QUICK_ACTIONS.map((action) => (
                <ActionCard
                  key={action.title}
                  action={action}
                  onClick={() => handleQuickAction(action.title)}
                />
              ))}
            </div>
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          {/* CANDIDATE INTERVIEWS SECTION */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Your Interviews</h2>
              <p className="text-muted-foreground">Your journey to success starts here</p>
            </div>

            <div className="glass-subtle rounded-2xl p-8">
              {interviews === undefined ? (
                <div className="flex justify-center py-16">
                  <div className="glass rounded-full p-4">
                    <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                </div>
              ) : interviews.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {interviews.map((interview) => (
                    <MeetingCard key={interview._id} interview={interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="glass rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <SparklesIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">No interviews yet</h3>
                    <p className="text-muted-foreground">
                      Your scheduled interviews will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}