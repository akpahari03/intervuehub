"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, ClockIcon, XCircleIcon, PlusIcon, TrendingUpIcon } from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";

type Interview = Doc<"interviews">;

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleStatusUpdate = async (interviewId: Id<"interviews">, status: string) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="container mx-auto py-10 space-y-12">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl float-delayed" />
        
        <div className="relative glass-strong rounded-3xl p-8 border-gradient">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="glass-subtle rounded-full p-3 glow-blue">
                  <TrendingUpIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
                  <p className="text-muted-foreground text-lg">
                    Manage and review your interviews
                  </p>
                </div>
              </div>
            </div>

            <Link href="/schedule">
              <Button className="glass-strong border-0 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 ripple glow-blue">
                <PlusIcon className="h-5 w-5 mr-2" />
                Schedule New Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="space-y-10">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id} className="space-y-6">
                {/* CATEGORY HEADER */}
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <Badge 
                    variant={category.variant}
                    className={`
                      glass-subtle border-0 px-4 py-1 text-sm font-medium
                      ${category.id === 'succeeded' ? 'bg-green-500/20 text-green-400' : ''}
                      ${category.id === 'failed' ? 'bg-red-500/20 text-red-400' : ''}
                      ${category.id === 'completed' ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${category.id === 'upcoming' ? 'bg-purple-500/20 text-purple-400' : ''}
                    `}
                  >
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>

                {/* INTERVIEWS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedInterviews[category.id].map((interview: Interview) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);

                    return (
                      <Card key={interview._id} className="group glass liquid-hover border-0 overflow-hidden">
                        {/* Status indicator line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${
                          category.id === 'succeeded' ? 'bg-gradient-to-r from-green-500/50 to-emerald-500/50' :
                          category.id === 'failed' ? 'bg-gradient-to-r from-red-500/50 to-rose-500/50' :
                          category.id === 'completed' ? 'bg-gradient-to-r from-blue-500/50 to-cyan-500/50' :
                          'bg-gradient-to-r from-purple-500/50 to-violet-500/50'
                        }`} />

                        {/* CANDIDATE INFO */}
                        <CardHeader className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-12 w-12 ring-2 ring-white/10">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className="glass-subtle border-0 text-sm font-medium">
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500/80 border-2 border-background" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-blue-500 transition-colors duration-300">
                                {candidateInfo.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        {/* DATE & TIME */}
                        <CardContent className="p-6 pt-0">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{format(startTime, "MMM dd")}</span>
                            </div>
                            <div className="flex items-center gap-2 glass-subtle rounded-full px-3 py-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>{format(startTime, "hh:mm a")}</span>
                            </div>
                          </div>
                        </CardContent>

                        {/* ACTIONS */}
                        <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                className="flex-1 glass-subtle border-0 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition-all duration-300 ripple"
                                onClick={() => handleStatusUpdate(interview._id, "succeeded")}
                              >
                                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                className="flex-1 glass-subtle border-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 ripple"
                                onClick={() => handleStatusUpdate(interview._id, "failed")}
                              >
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}
                          <CommentDialog interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;