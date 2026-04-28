import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Save, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { getLastPrediction, resetItemFlow, saveRiskHistory } from "@/lib/item-flow";

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const p = getLastPrediction();
    if (!p) navigate("/capture", { replace: true });
    else setPrediction(p);
  }, [navigate]);

  if (!prediction) return null;

  const { riskLevel, probability, confidence, keyDrivers, imageUrl } = prediction;
  const wasteScore = Math.min(10, Math.max(1, Math.round(probability / 10)));

  const persist = () => {
    saveRiskHistory({
      timestamp: new Date().toISOString(),
      itemDetails: prediction.itemDetails,
      itemFeatures: prediction.itemFeatures,
      prediction: {
        score: prediction.score ?? probability / 100,
        label: riskLevel,
        probability,
      },
      feedback: feedback || "unsure",
    });
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Results</h1>
          <p className="text-lg text-muted-foreground">Here is our prediction for this item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {imageUrl ? (
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <h3 className="text-base font-bold text-foreground mb-3">Item image</h3>
                  <div className="rounded-lg border border-border overflow-hidden bg-muted aspect-square flex items-center justify-center">
                    <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-border bg-card">
              <CardContent className="pt-6 text-center space-y-4">
                <h2 className="text-xl text-foreground">Return Risk Level</h2>
                <Badge className="text-3xl px-8 py-3 bg-primary text-primary-foreground">{riskLevel}</Badge>
                <Progress value={probability} className="h-4" />
                <p className="text-base text-muted-foreground">{probability}% likelihood of return</p>
                <p className="text-sm text-muted-foreground">Model confidence: {confidence}%</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-2">
                <h3 className="text-base font-bold text-foreground mb-3">Sustainability signal</h3>
                <p className="text-base text-muted-foreground">
                  Higher return risk usually means more shipping, packaging, and inventory waste. Rough impact index:{" "}
                  <span className="font-semibold text-foreground">{wasteScore}</span> / 10 (derived from this
                  prediction, not a third-party audit).
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-2">
                <h3 className="text-base font-bold text-foreground mb-3">Key Drivers</h3>
                <div className="space-y-3 text-base text-muted-foreground">
                  {keyDrivers?.length ? (
                    keyDrivers.map((text, i) => (
                      <div key={`${text}-${i}`} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))
                  ) : (
                    <p>No standout drivers for this run.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-3">
                <h3 className="text-base font-bold text-foreground">Your Feedback</h3>
                <p className="text-sm text-muted-foreground">How do you feel about this item?</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={feedback === "keep" ? "default" : "outline"}
                    className="gap-2 py-5 text-base"
                    onClick={() => setFeedback("keep")}
                  >
                    <ThumbsUp className="w-5 h-5" /> Keep
                  </Button>
                  <Button
                    type="button"
                    variant={feedback === "return" ? "default" : "outline"}
                    className="gap-2 py-5 text-base"
                    onClick={() => setFeedback("return")}
                  >
                    <ThumbsDown className="w-5 h-5" /> Return
                  </Button>
                  <Button
                    type="button"
                    variant={feedback === "unsure" ? "default" : "outline"}
                    className="gap-2 py-5 text-base"
                    onClick={() => setFeedback("unsure")}
                  >
                    <HelpCircle className="w-5 h-5" /> Not Sure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="button"
                  className="w-full bg-primary text-primary-foreground text-xl py-6 gap-3"
                  onClick={() => {
                    persist();
                  }}
                >
                  <Save className="w-6 h-6" /> Save Result
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 mt-2 text-base py-5"
                  asChild
                >
                  <Link
                    to="/capture"
                    onClick={() => {
                      resetItemFlow();
                    }}
                  >
                    <RefreshCw className="w-5 h-5" /> Scan Another Item
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResultsScreen;
