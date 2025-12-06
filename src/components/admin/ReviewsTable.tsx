import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import StarRating from "../StarRating";
import { MessageSquare, Lightbulb } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  review: string;
  ai_summary: string | null;
  ai_recommended_actions: string | null;
  created_at: string;
}

interface ReviewsTableProps {
  reviews: Review[];
}

const ReviewsTable = ({ reviews }: ReviewsTableProps) => {
  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4) return "default";
    if (rating >= 3) return "secondary";
    return "destructive";
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Rating</TableHead>
            <TableHead className="w-[250px]">Review</TableHead>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Summary
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Recommended Actions
              </div>
            </TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                No reviews yet. They'll appear here in real-time.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <StarRating rating={review.rating} readonly size="sm" />
                    <Badge variant={getRatingBadgeVariant(review.rating)} className="w-fit">
                      {review.rating}/5
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-3">{review.review}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {review.ai_summary || "Generating..."}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                    {review.ai_recommended_actions || "Generating..."}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewsTable;
