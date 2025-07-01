import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, PlusIcon, CalendarIcon, UsersIcon, ClockIcon, SparklesIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Interview scheduled successfully! 🎉");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CalendarIcon className="w-4 h-4" />
            Interview Scheduler
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Schedule{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Interviews
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Plan and organize technical interviews with candidates using our comprehensive scheduling system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="bg-gradient-surface border border-border/60 rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{interviews.length}</p>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-surface border border-border/60 rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{candidates.length}</p>
                <p className="text-sm text-muted-foreground">Candidates</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-surface border border-border/60 rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {interviews.filter(i => i.status === "upcoming").length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex justify-center mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {/* Enhanced Schedule Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-3 h-12 px-8 text-lg font-semibold bg-gradient-primary hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 rounded-2xl">
                <PlusIcon className="h-5 w-5" />
                Schedule New Interview
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border/60">
              <DialogHeader className="text-center pb-2">
                <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  New Interview
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Enhanced Title Input */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/20 rounded-md"></div>
                    Interview Title
                  </label>
                  <Input
                    placeholder="e.g., Frontend Developer Technical Interview"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11 rounded-xl border-border/60 focus:border-primary/60 transition-all duration-200"
                  />
                </div>

                {/* Enhanced Description */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500/20 rounded-md"></div>
                    Description
                  </label>
                  <Textarea
                    placeholder="Technical interview focusing on React, JavaScript, and system design..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="rounded-xl border-border/60 focus:border-primary/60 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Enhanced Candidate Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/20 rounded-md"></div>
                    Candidate
                  </label>
                  <Select
                    value={formData.candidateId}
                    onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-border/60">
                      <SelectValue placeholder="Select candidate to interview" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/20">
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.clerkId} value={candidate.clerkId} className="rounded-lg">
                          <UserInfo user={candidate} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Interviewers Section */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500/20 rounded-md"></div>
                    Interviewers
                  </label>
                  
                  {selectedInterviewers.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl border border-border/30">
                      {selectedInterviewers.map((interviewer) => (
                        <div
                          key={interviewer.clerkId}
                          className="inline-flex items-center gap-2 bg-background px-3 py-2 rounded-lg text-sm border border-border/30 hover:border-primary/30 transition-colors"
                        >
                          <UserInfo user={interviewer} />
                          {interviewer.clerkId !== user?.id && (
                            <button
                              onClick={() => removeInterviewer(interviewer.clerkId)}
                              className="hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {availableInterviewers.length > 0 && (
                    <Select onValueChange={addInterviewer}>
                      <SelectTrigger className="h-11 rounded-xl border-border/60">
                        <SelectValue placeholder="Add another interviewer" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/20">
                        {availableInterviewers.map((interviewer) => (
                          <SelectItem key={interviewer.clerkId} value={interviewer.clerkId} className="rounded-lg">
                            <UserInfo user={interviewer} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Enhanced Date & Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 max-w-3xl mx-auto">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500/20 rounded-md"></div>
                      Date
                    </label>
                    <div className="border border-border/60 rounded-xl p-3 bg-background min-w-[250px] max-w-full">

                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData({ ...formData, date })}
                        disabled={(date) => date < new Date()}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500/20 rounded-md"></div>
                      Time
                    </label>
                    <div className="space-y-3">
                      <Select
                        value={formData.time}
                        onValueChange={(time) => setFormData({ ...formData, time })}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/20 max-h-48">
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time} className="rounded-lg">
                              <span className="font-mono">{time}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="bg-muted/50 border border-border/30 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-2">📅 Interview Details</p>
                        <p className="text-sm font-medium text-foreground">
                          {formData.date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">at {formData.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border/30">
                  <Button 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    className="rounded-xl border-border/60 hover:border-primary/40 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={scheduleMeeting} 
                    disabled={isCreating}
                    className="bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-xl"
                  >
                    {isCreating ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="mr-2 size-4" />
                        Schedule Interview
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Interviews List */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          {!interviews ? (
            <div className="flex justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center animate-pulse">
                  <Loader2Icon className="size-8 animate-spin text-white" />
                </div>
                <p className="text-muted-foreground">Loading interviews...</p>
              </div>
            </div>
          ) : interviews.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Scheduled Interviews</h2>
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  {interviews.length} interview{interviews.length !== 1 ? 's' : ''} total
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview, index) => (
                  <div 
                    key={interview._id} 
                    style={{ animationDelay: `${index * 100}ms` }} 
                    className="animate-fade-in"
                  >
                    <MeetingCard interview={interview} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/25">
                <CalendarIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No interviews scheduled yet</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Get started by scheduling your first technical interview with a candidate
              </p>
              <Button 
                onClick={() => setOpen(true)}
                className="bg-gradient-primary hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 rounded-2xl h-12 px-8 text-lg font-semibold"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Schedule Your First Interview
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewScheduleUI;