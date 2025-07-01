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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Enhanced Welcome Section */}
        <div className="mb-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4" />
            {isInterviewer ? "Interviewer Portal" : "Candidate Portal"}
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            {isInterviewer ? (
              <>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Interview
                </span>{" "}
                Dashboard
              </>
            ) : (
              <>
                Your{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Interviews
                </span>
              </>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isInterviewer
              ? "Conduct seamless technical interviews, evaluate candidates, and make informed hiring decisions with our comprehensive interview platform"
              : "Join your scheduled technical interviews and demonstrate your skills in a professional environment"}
          </p>
        </div>

        {isInterviewer ? (
          <>
            {/* Enhanced Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-slide-up">
              {QUICK_ACTIONS.map((action, index) => (
                <div key={action.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                  <ActionCard
                    action={action}
                    onClick={() => handleQuickAction(action.title)}
                  />
                </div>
              ))}
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
            {/* Enhanced Interviews Section */}
            <div className="space-y-8 animate-slide-up">
              {interviews === undefined ? (
                <div className="flex justify-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse">
                      <Loader2Icon className="h-6 w-6 animate-spin text-white" />
                    </div>
                    <p className="text-muted-foreground">Loading your interviews...</p>
                  </div>
                </div>
              ) : interviews.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {interviews.map((interview, index) => (
                    <div key={interview._id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                      <MeetingCard interview={interview} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-8 h-8 bg-white rounded-xl"></div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">No interviews scheduled</h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Your upcoming technical interviews will appear here once they're scheduled
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}