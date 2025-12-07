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
      let temp = await callGemini(review + ' give me the AI Repopnse, AI Summary , and AI Recommended Actions in separate lines');
      const aiResponse = temp.split("AI Response:")[1].split("AI Summary:")[0].trim();
      const aiSummary = temp.split("AI Summary:")[1].split("AI Recommended Actions:")[0].trim();
      const aiActions = temp.split("AI Recommended Actions:")[1].trim();
      // Store the review with AI data
      const { error: insertError } = await supabase.from("reviews").insert({
        rating,
        review: review.trim(),
        ai_response: aiResponse.replace(/\*\*/g, "").trim() || null,
        ai_summary: aiSummary.replace(/\*\*/g, "").trim() || null,
        ai_recommended_actions: aiActions.replace(/\*\*/g, "").trim() || null,
      });

      if (insertError) throw insertError;
      toast.success("Review submitted successfully!");
      onSuccess( aiResponse.replace(/\*\*/g, "").trim() || "Thank you for your feedback!");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function callGemini(prompt) {
    const apiKey = ''; 
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_googleAPI}`,  // REQUIRED!
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash-lite",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  }


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
