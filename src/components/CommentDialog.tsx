import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon, SendIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("3");

  const addComment = useMutation(api.comments.addComment);
  const users = useQuery(api.users.getUsers);
  const existingComments = useQuery(api.comments.getComments, { interviewId });

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter comment");

    try {
      await addComment({
        interviewId,
        content: comment.trim(),
        rating: parseInt(rating),
      });

      toast.success("Comment submitted");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit comment");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-4 w-4 transition-colors duration-200 ${
            starValue <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );

  if (existingComments === undefined || users === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button className="w-full glass-subtle border-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-300 ripple">
          <MessageSquareIcon className="h-4 w-4 mr-2" />
          Add Comment
          {existingComments.length > 0 && (
            <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-0 text-xs">
              {existingComments.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] glass border-0 max-h-[80vh] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />
        
        <div className="relative">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="glass-subtle rounded-full p-2">
                <MessageSquareIcon className="w-5 h-5 text-blue-500" />
              </div>
              <DialogTitle className="text-xl gradient-text">Interview Comments</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* EXISTING COMMENTS */}
            {existingComments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Previous Comments</h4>
                  <Badge className="glass-subtle border-0 bg-blue-500/20 text-blue-400">
                    {existingComments.length} Comment{existingComments.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-4">
                    {existingComments.map((comment, index) => {
                      const interviewer = getInterviewerInfo(users, comment.interviewerId);
                      return (
                        <div key={index} className="glass-subtle rounded-xl p-4 space-y-3 liquid-hover">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 ring-2 ring-white/10">
                                <AvatarImage src={interviewer.image} />
                                <AvatarFallback className="glass-subtle border-0 text-xs">
                                  {interviewer.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{interviewer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                                </p>
                              </div>
                            </div>
                            <div className="glass-subtle rounded-full px-3 py-1">
                              {renderStars(comment.rating)}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed pl-11">{comment.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* NEW COMMENT FORM */}
            <div className="glass-subtle rounded-xl p-6 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <SendIcon className="w-4 h-4 text-blue-500" />
                Add Your Comment
              </h4>
              
              <div className="space-y-4">
                {/* RATING */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rating</Label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger className="glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="glass border-0">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem 
                          key={value} 
                          value={value.toString()}
                          className="focus:bg-white/10 rounded-lg mx-1"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{value}</span>
                            {renderStars(value)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* COMMENT */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Comment</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your detailed feedback about the candidate's performance..."
                    className="h-32 glass-subtle border-0 focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="glass-subtle border-0 hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="glass-strong border-0 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-all duration-300 ripple glow-blue"
            >
              <SendIcon className="w-4 h-4 mr-2" />
              Submit Comment
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;