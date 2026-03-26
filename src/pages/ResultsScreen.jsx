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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Results</h1>
          <p className="text-muted-foreground">Here's our prediction for this item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Risk Level */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 text-center space-y-4">
                <h2 className="text-lg text-foreground">Return Risk Level</h2>
                <Badge className="text-2xl px-6 py-2 bg-primary text-primary-foreground">
                  Medium
                </Badge>
                <Progress value={55} className="h-3" />
                <p className="text-sm text-muted-foreground">55% likelihood of return</p>
              </CardContent>
            </Card>

            {/* Key Drivers */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-2">
                <h3 className="text-sm font-bold text-foreground mb-2">Key Drivers</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
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
                <h3 className="text-sm font-bold text-foreground">Your Feedback</h3>
                <p className="text-xs text-muted-foreground">How do you feel about this item?</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2 py-4">
                    <ThumbsUp className="w-4 h-4" /> Keep
                  </Button>
                  <Button variant="outline" className="gap-2 py-4">
                    <ThumbsDown className="w-4 h-4" /> Return
                  </Button>
                  <Button variant="outline" className="gap-2 py-4">
                    <HelpCircle className="w-4 h-4" /> Unsure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full bg-primary text-primary-foreground text-lg py-5 gap-2">
                  <Save className="w-5 h-5" /> Save Result
                </Button>
                <Link to="/capture">
                  <Button variant="outline" className="w-full gap-2 mt-2">
                    <RefreshCw className="w-4 h-4" /> Scan Another Item
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Behavior Table */}
            <div className="bg-muted rounded-lg px-6 py-4 text-xs text-muted-foreground">
              <p className="font-bold mb-1">System Behavior:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Screen loads → displays prediction data from analysis</li>
                <li>Feedback option → records likely keep / likely return / not sure</li>
                <li>"Save Result" → saves to History with outcome status = Pending</li>
                <li>"Scan Another" → clears temp data, goes to Capture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResultsScreen;
