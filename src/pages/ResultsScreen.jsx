import { Link } from "react-router-dom";
import { Save, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const ResultsScreen = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Results</h1>
          <p className="text-lg text-muted-foreground">Here's our prediction for this item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Risk Level */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 text-center space-y-4">
                <h2 className="text-xl text-foreground">Return Risk Level</h2>
                <Badge className="text-3xl px-8 py-3 bg-primary text-primary-foreground">
                  Medium
                </Badge>
                <Progress value={55} className="h-4" />
                <p className="text-base text-muted-foreground">55% likelihood of return</p>
              </CardContent>
            </Card>

            {/* Key Drivers */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-2">
                <h3 className="text-base font-bold text-foreground mb-3">Key Drivers</h3>
                <div className="space-y-3 text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Size mismatch with your usual preference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span>Material not commonly in your wardrobe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Price above your typical budget range</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Feedback */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-3">
                <h3 className="text-base font-bold text-foreground">Your Feedback</h3>
                <p className="text-sm text-muted-foreground">How do you feel about this item?</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2 py-5 text-base">
                    <ThumbsUp className="w-5 h-5" /> Keep
                  </Button>
                  <Button variant="outline" className="gap-2 py-5 text-base">
                    <ThumbsDown className="w-5 h-5" /> Return
                  </Button>
                  <Button variant="outline" className="gap-2 py-5 text-base">
                    <HelpCircle className="w-5 h-5" /> Unsure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full bg-primary text-primary-foreground text-xl py-6 gap-3">
                  <Save className="w-6 h-6" /> Save Result
                </Button>
                <Link to="/capture">
                  <Button variant="outline" className="w-full gap-2 mt-2 text-base py-5">
                    <RefreshCw className="w-5 h-5" /> Scan Another Item
                  </Button>
                </Link>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResultsScreen;
