import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Save, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { getLastPrediction, resetItemFlow, saveRiskHistory, postFeedback, ensureItemSessionId } from "@/lib/item-flow";
import { toast } from "sonner";

const RISK_CFG = {
  High:   { badge: "bg-destructive text-white",   bar: "bg-destructive", card: "border-destructive/40 bg-destructive/5",   dot: "bg-destructive"  },
  Medium: { badge: "bg-amber-500 text-white",      bar: "bg-amber-500",   card: "border-amber-400/40 bg-amber-500/5",       dot: "bg-amber-500"    },
  Low:    { badge: "bg-green-600 text-white",      bar: "bg-green-500",   card: "border-green-500/40 bg-green-500/5",       dot: "bg-green-500"    },
};

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
  const cfg = RISK_CFG[riskLevel] ?? { badge: "bg-primary text-primary-foreground", bar: "bg-primary", card: "border-border bg-card", dot: "bg-primary" };

  const FEEDBACK_MAP = {
    keep: "Likely Keep",
    return: "Return",
    unsure: "Not Sure",
  };

  const persist = async () => {
    const backendFeedback = feedback ? FEEDBACK_MAP[feedback] : null;
    saveRiskHistory({
      timestamp: new Date().toISOString(),
      itemDetails: prediction.itemDetails,
      itemFeatures: prediction.itemFeatures,
      prediction: {
        score: prediction.score ?? probability / 100,
        label: riskLevel,
        probability,
      },
      feedback: backendFeedback,
    });
    try {
      if (backendFeedback) {
        const sessionId = ensureItemSessionId();
        await postFeedback(sessionId, backendFeedback);
      }
      toast.success("Result saved!");
    } catch {
      toast.error("Saved locally but could not sync feedback to server.");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Results</h1>
          <p className="text-lg text-muted-foreground">Here is our prediction for this item.</p>
        </div>

        {/* Risk Level — hero, full width, colored by risk level */}
        <Card className={`mb-8 border-2 ${cfg.card}`}>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <h2 className="text-xl text-foreground font-medium">Return Risk Level</h2>
            <Badge className={`text-3xl px-10 py-3 ${cfg.badge}`}>{riskLevel} Risk</Badge>
            {/* Custom progress bar colored by risk */}
            <div className="h-3 rounded-full bg-black/10 max-w-sm mx-auto overflow-hidden">
              <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${probability}%` }} />
            </div>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              <span>{probability}% likelihood of return</span>
              <span>·</span>
              <span>Model confidence: {confidence}%</span>
              <span>·</span>
              <span>Sustainability index: <span className="font-semibold text-foreground">{wasteScore}</span>/10</span>
            </div>
          </CardContent>
        </Card>

        {/* Image + Key Drivers — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {imageUrl ? (
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <h3 className="text-base font-bold text-foreground mb-3">Item Image</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-muted aspect-square flex items-center justify-center">
                  <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border bg-card">
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-base font-bold text-foreground">Key Drivers</h3>
              <div className="space-y-4 text-base text-muted-foreground">
                {keyDrivers?.length ? (
                  keyDrivers.map((text, i) => (
                    <div key={`${text}-${i}`} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-2`} />
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

        {/* Feedback + Actions — full width */}
        <Card className="border-border bg-card mb-4">
          <CardContent className="pt-6 pb-6 space-y-5">
            <div className="text-center">
              <h3 className="text-base font-bold text-foreground">What's your plan?</h3>
              <p className="text-sm text-muted-foreground mt-1">Optional — helps us track your decision alongside the prediction.</p>
            </div>
            {/* Intuitively colored decision buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                type="button"
                variant="ghost"
                className={`gap-2 py-5 px-7 text-base border-2 rounded-lg transition-all ${
                  feedback === "return"
                    ? "bg-destructive/10 text-destructive border-destructive"
                    : "border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                }`}
                onClick={() => setFeedback(feedback === "return" ? null : "return")}
              >
                <ThumbsDown className="w-5 h-5" /> Return It
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`gap-2 py-5 px-7 text-base border-2 rounded-lg transition-all ${
                  feedback === "keep"
                    ? "bg-green-500/10 text-green-700 border-green-500"
                    : "border-border text-muted-foreground hover:bg-green-500/10 hover:text-green-700 hover:border-green-500/40"
                }`}
                onClick={() => setFeedback(feedback === "keep" ? null : "keep")}
              >
                <ThumbsUp className="w-5 h-5" /> Keep It
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`gap-2 py-5 px-7 text-base border-2 rounded-lg transition-all ${
                  feedback === "unsure"
                    ? "bg-muted text-foreground border-muted-foreground/40"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground/30"
                }`}
                onClick={() => setFeedback(feedback === "unsure" ? null : "unsure")}
              >
                <HelpCircle className="w-5 h-5" /> Undecided
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Button
                type="button"
                className="flex-1 bg-primary text-primary-foreground text-lg py-6 gap-2 shadow-sm hover:shadow-md transition-shadow"
                onClick={async () => { await persist(); }}
              >
                <Save className="w-5 h-5" /> Save Result
              </Button>
              <Button variant="outline" className="flex-1 gap-2 text-base py-6" asChild>
                <Link to="/capture" onClick={() => { resetItemFlow(); }}>
                  <RefreshCw className="w-5 h-5" /> Scan Another
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ResultsScreen;
