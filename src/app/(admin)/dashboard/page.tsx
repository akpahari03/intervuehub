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
import { CalendarIcon, CheckCircle2Icon, ClockIcon, XCircleIcon, PlusIcon } from "lucide-react";
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
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Interview Management
            </h1>
            <p className="text-muted-foreground">
              Review candidates and manage interview outcomes
            </p>
          </div>
          
          <Link href="/schedule">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Schedule Interview
            </Button>
          </Link>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {INTERVIEW_CATEGORY.map(
            (category) =>
              groupedInterviews[category.id]?.length > 0 && (
                <section key={category.id} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-medium text-foreground">
                      {category.title}
                    </h2>
                    <Badge 
                      variant="outline" 
                      className="bg-background text-xs px-2 py-1"
                    >
                      {groupedInterviews[category.id].length}
                    </Badge>
                  </div>

                  {/* Interview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedInterviews[category.id].map((interview: Interview) => {
                      const candidateInfo = getCandidateInfo(users, interview.candidateId);
                      const startTime = new Date(interview.startTime);

                      return (
                        <Card 
                          key={interview._id}
                          className="border border-border hover:border-primary/20 transition-all duration-200"
                        >
                          {/* Candidate Header */}
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className="text-xs">
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-sm font-medium text-foreground truncate">
                                  {candidateInfo.name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground truncate">
                                  {interview.title}
                                </p>
                              </div>
                            </div>
                          </CardHeader>

                          {/* Time Info */}
                          <CardContent className="py-3">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {format(startTime, "MMM dd")}
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {format(startTime, "hh:mm a")}
                              </div>
                            </div>
                          </CardContent>

                          {/* Actions */}
                          <CardFooter className="pt-0 space-y-2">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  size="sm"
                                  className="flex-1 h-8 text-xs"
                                  onClick={() => handleStatusUpdate(interview._id, "succeeded")}
                                >
                                  <CheckCircle2Icon className="h-3 w-3 mr-1" />
                                  Pass
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1 h-8 text-xs"
                                  onClick={() => handleStatusUpdate(interview._id, "failed")}
                                >
                                  <XCircleIcon className="h-3 w-3 mr-1" />
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

        {/* Empty State */}
        {Object.keys(groupedInterviews).length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-muted-foreground/30 rounded-sm"></div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Schedule your first interview to get started
            </p>
            <Link href="/schedule">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;