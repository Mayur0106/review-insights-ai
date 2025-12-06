import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Sparkles } from "lucide-react";
import StarRating from "./StarRating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  onSuccess: (aiResponse: string) => void;
}

const ReviewForm = ({ onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    
    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate AI response
      const { data: responseData, error: responseError } = await supabase.functions.invoke(
        "process-review",
        { body: { review, rating, type: "response" } }
      );
      
      if (responseError) throw responseError;
      
      // Generate AI summary
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke(
        "process-review",
        { body: { review, rating, type: "summary" } }
      );
      
      if (summaryError) throw summaryError;

      // Generate AI recommended actions
      const { data: actionsData, error: actionsError } = await supabase.functions.invoke(
        "process-review",
        { body: { review, rating, type: "actions" } }
      );
      
      if (actionsError) throw actionsError;

      // Store the review with AI data
      const { error: insertError } = await supabase.from("reviews").insert({
        rating,
        review: review.trim(),
        ai_response: responseData?.result || null,
        ai_summary: summaryData?.result || null,
        ai_recommended_actions: actionsData?.result || null,
      });

      if (insertError) throw insertError;

      toast.success("Review submitted successfully!");
      onSuccess(responseData?.result || "Thank you for your feedback!");
      
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-glow border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Share Your Experience</CardTitle>
        <CardDescription className="text-base">
          Your feedback helps us improve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-muted-foreground">
              How would you rate your experience?
            </label>
            <div className="flex justify-center py-2">
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="review" className="block text-sm font-medium text-muted-foreground">
              Tell us more about your experience
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like? What could be better?"
              className="min-h-[120px] resize-none bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {review.length}/500 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
