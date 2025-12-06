-- Create reviews table for storing all feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  ai_response TEXT,
  ai_summary TEXT,
  ai_recommended_actions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert reviews (public form)
CREATE POLICY "Anyone can insert reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create policy for anyone to read reviews (for admin dashboard)
CREATE POLICY "Anyone can read reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Enable realtime for live updates in admin dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;