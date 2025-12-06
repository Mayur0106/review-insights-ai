import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, MessageSquare } from "lucide-react";

interface ThankYouCardProps {
  aiResponse: string;
  onReset: () => void;
}

const ThankYouCard = ({ aiResponse, onReset }: ThankYouCardProps) => {
  return (
    <Card className="w-full max-w-lg shadow-glow border-0 bg-card/80 backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
            <p className="text-foreground leading-relaxed">{aiResponse}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full h-11"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Submit Another Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThankYouCard;
