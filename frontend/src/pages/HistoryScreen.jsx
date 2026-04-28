import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { getRiskHistory, clearRiskHistory } from "@/lib/item-flow";

const riskConfig = {
  High:    { stripe: "bg-destructive",      text: "text-destructive",      label: "High Risk" },
  Medium:  { stripe: "bg-yellow-400",       text: "text-yellow-600",       label: "Medium Risk" },
  Low:     { stripe: "bg-green-500",        text: "text-green-600",        label: "Low Risk" },
  Unknown: { stripe: "bg-muted-foreground", text: "text-muted-foreground", label: "Unknown" },
};

const feedbackLabel = {
  "Likely Keep": "Plan to keep",
  "Return":      "Plan to return",
  "Not Sure":    "Undecided",
};

const HistoryScreen = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries([...getRiskHistory()].reverse());
  }, []);

  const handleClear = () => {
    clearRiskHistory();
    setEntries([]);
  };

  if (!entries.length) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-8 py-24 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <History className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">No History Yet</h1>
          <p className="text-lg text-muted-foreground">
            Analyze an item to see saved predictions here.
          </p>
          <Link to="/capture">
            <Button className="gap-2 text-lg px-8 py-5 mt-2">
              <Camera className="w-5 h-5" /> Scan an Item
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">History</h1>
            <p className="text-muted-foreground text-base">
              {entries.length} saved result{entries.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive border-destructive/40 hover:bg-destructive/10"
            onClick={handleClear}
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        </div>

        <div className="space-y-3">
          {entries.map((entry, i) => {
            const label = entry.prediction?.label ?? "Unknown";
            const probability = entry.prediction?.probability ?? 0;
            const details = entry.itemDetails ?? {};
            const cfg = riskConfig[label] ?? riskConfig.Unknown;
            const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
              month: "short", day: "numeric", year: "numeric",
              hour: "numeric", minute: "2-digit",
            });
            const title = [details.category, details.brand].filter(Boolean).join(" · ") || "Item";
            const meta = [
              details.size ? `Size ${details.size}` : null,
              details.price != null ? `$${details.price}` : null,
              details.material || null,
            ].filter(Boolean).join(" · ");

            return (
              <Card key={i} className="border-border bg-card overflow-hidden">
                <div className="flex">
                  {/* Left accent stripe */}
                  <div className={`w-1.5 shrink-0 ${cfg.stripe}`} />
                  <CardContent className="pt-4 pb-4 px-5 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-foreground">{title}</span>
                          {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
                        </div>
                        {/* Risk bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${cfg.stripe}`}
                              style={{ width: `${probability}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold shrink-0 ${cfg.text}`}>
                            {cfg.label} · {probability}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{date}</span>
                          {entry.feedback && (
                            <>
                              <span>·</span>
                              <span>{feedbackLabel[entry.feedback] ?? entry.feedback}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryScreen;
