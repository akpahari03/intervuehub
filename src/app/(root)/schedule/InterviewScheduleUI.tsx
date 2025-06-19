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
import { Loader2Icon, XIcon, CalendarPlusIcon, SparklesIcon, ClockIcon } from "lucide-react";
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
      toast.success("Meeting scheduled successfully!");

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
      toast.error("Failed to schedule meeting. Please try again.");
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
    <div className="container max-w-7xl mx-auto p-6 space-y-12">
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
                  <CalendarPlusIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Schedule Interviews</h1>
                  <p className="text-muted-foreground text-lg">
                    Plan and organize your interview sessions
                  </p>
                </div>
              </div>
            </div>

            {/* SCHEDULE DIALOG */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="glass-strong border-0 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 ripple glow-blue">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Schedule Interview
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-auto glass border-0">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />
                
                <div className="relative">
                  <DialogHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="glass-subtle rounded-full p-2">
                        <CalendarPlusIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <DialogTitle className="text-xl gradient-text">Schedule New Interview</DialogTitle>
                    </div>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-6">
                    {/* INTERVIEW TITLE */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interview Title</label>
                      <Input
                        placeholder="e.g. Frontend Developer Interview"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* INTERVIEW DESCRIPTION */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Interview focus areas, requirements, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50 resize-none"
                      />
                    </div>

                    {/* CANDIDATE SELECTION */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Candidate</label>
                      <Select
                        value={formData.candidateId}
                        onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                      >
                        <SelectTrigger className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                          <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                        <SelectContent className="glass border-0">
                          {candidates.map((candidate) => (
                            <SelectItem 
                              key={candidate.clerkId} 
                              value={candidate.clerkId}
                              className="focus:bg-white/10 rounded-lg mx-1"
                            >
                              <UserInfo user={candidate} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* INTERVIEWERS SELECTION */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Interviewers</label>
                      
                      {/* Selected interviewers */}
                      <div className="flex flex-wrap gap-2">
                        {selectedInterviewers.map((interviewer) => (
                          <div
                            key={interviewer.clerkId}
                            className="glass-subtle rounded-full px-3 py-2 text-sm flex items-center gap-2 liquid-hover"
                          >
                            <UserInfo user={interviewer} />
                            {interviewer.clerkId !== user?.id && (
                              <button
                                onClick={() => removeInterviewer(interviewer.clerkId)}
                                className="hover:text-red-400 transition-colors ml-1"
                              >
                                <XIcon className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Add more interviewers */}
                      {availableInterviewers.length > 0 && (
                        <Select onValueChange={addInterviewer}>
                          <SelectTrigger className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                            <SelectValue placeholder="Add more interviewers" />
                          </SelectTrigger>
                          <SelectContent className="glass border-0">
                            {availableInterviewers.map((interviewer) => (
                              <SelectItem 
                                key={interviewer.clerkId} 
                                value={interviewer.clerkId}
                                className="focus:bg-white/10 rounded-lg mx-1"
                              >
                                <UserInfo user={interviewer} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* DATE & TIME SELECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* DATE PICKER */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <div className="glass-subtle rounded-lg p-2">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => date && setFormData({ ...formData, date })}
                            disabled={(date) => date < new Date()}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* TIME PICKER */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Select
                          value={formData.time}
                          onValueChange={(time) => setFormData({ ...formData, time })}
                        >
                          <SelectTrigger className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="glass border-0 max-h-60">
                            {TIME_SLOTS.map((time) => (
                              <SelectItem 
                                key={time} 
                                value={time}
                                className="focus:bg-white/10 rounded-lg mx-1"
                              >
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-blue-500" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        className="glass-subtle border-0 hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={scheduleMeeting} 
                        disabled={isCreating}
                        className="glass-strong border-0 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-all duration-300 ripple glow-blue"
                      >
                        {isCreating ? (
                          <>
                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="mr-2 size-4" />
                            Schedule Interview
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* INTERVIEWS LIST */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Scheduled Interviews</h2>
          <p className="text-muted-foreground">Manage your upcoming and past interviews</p>
        </div>

        {!interviews ? (
          <div className="flex justify-center py-16">
            <div className="glass rounded-full p-4">
              <Loader2Icon className="size-8 animate-spin text-blue-500" />
            </div>
          </div>
        ) : interviews.length > 0 ? (
          <div className="glass-subtle rounded-2xl p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => (
                <MeetingCard key={interview._id} interview={interview} />
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-subtle rounded-2xl p-16 text-center space-y-4">
            <div className="glass rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <CalendarPlusIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">No interviews scheduled</h3>
              <p className="text-muted-foreground">
                Click the "Schedule Interview" button to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewScheduleUI;