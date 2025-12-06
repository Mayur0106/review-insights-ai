import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import ThankYouCard from "@/components/ThankYouCard";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleSuccess = (response: string) => {
    setAiResponse(response);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setAiResponse("");
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground">Feedback Hub</h1>
            <Link 
              to="/admin"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          {isSubmitted ? (
            <ThankYouCard aiResponse={aiResponse} onReset={handleReset} />
          ) : (
            <ReviewForm onSuccess={handleSuccess} />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Powered by AI-driven insights
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
