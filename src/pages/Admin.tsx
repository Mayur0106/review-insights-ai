import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, BarChart3, Star, MessageSquare, Home, RefreshCw } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import ReviewsTable from "@/components/admin/ReviewsTable";
import RatingChart from "@/components/admin/RatingChart";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  review: string;
  ai_summary: string | null;
  ai_recommended_actions: string | null;
  created_at: string;
}

const Admin = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    // Set up realtime subscription
    const channel = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          console.log("Realtime update:", payload);
          if (payload.eventType === "INSERT") {
            setReviews((prev) => [payload.new as Review, ...prev]);
            toast.info("New review received!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtered reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.review.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  
  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" size="sm" onClick={fetchReviews} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            User View
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Reviews"
            value={totalReviews}
            icon={MessageSquare}
            description="All time submissions"
          />
          <StatsCard
            title="Average Rating"
            value={`${averageRating} ★`}
            icon={Star}
            trend={parseFloat(averageRating) >= 4 ? "up" : parseFloat(averageRating) >= 3 ? "neutral" : "down"}
            description="Across all reviews"
          />
          <StatsCard
            title="5-Star Reviews"
            value={reviews.filter((r) => r.rating === 5).length}
            icon={BarChart3}
            description={`${totalReviews > 0 ? Math.round((reviews.filter((r) => r.rating === 5).length / totalReviews) * 100) : 0}% of total`}
          />
        </div>

        {/* Chart */}
        <RatingChart data={ratingDistribution} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-0"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-0">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews Table */}
        <ReviewsTable reviews={filteredReviews} />
      </main>
    </div>
  );
};

export default Admin;
