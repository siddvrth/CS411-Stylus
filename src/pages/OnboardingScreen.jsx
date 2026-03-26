import { Link } from "react-router-dom";
import { ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const styleTags = ["Casual", "Formal", "Streetwear", "Athleisure", "Bohemian", "Minimalist", "Vintage"];

const OnboardingScreen = () => {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Set Up Your Style Profile</h1>
          <p className="text-muted-foreground">Help us learn your preferences to improve predictions.</p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Size */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Preferred Size</Label>
                <Select>
                  <SelectTrigger className="w-full bg-background border-border">
                    <SelectValue placeholder="Select size..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fit Preference */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Fit Preference</Label>
                <Select>
                  <SelectTrigger className="w-full bg-background border-border">
                    <SelectValue placeholder="Select fit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["Slim", "Regular", "Relaxed", "Oversized"].map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Style Tags */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Style Tags</Label>
              <div className="flex flex-wrap gap-2">
                {styleTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brand Preference */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Favorite Brands</Label>
              <Input placeholder="e.g. Nike, Zara, H&M..." className="bg-background border-border" />
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Budget Range</Label>
              <div className="flex gap-3">
                <Input placeholder="Min $" className="bg-background border-border" />
                <Input placeholder="Max $" className="bg-background border-border" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <Link to="/capture">
            <Button variant="ghost" className="text-muted-foreground gap-2">
              <SkipForward className="w-4 h-4" /> Skip for now
            </Button>
          </Link>
          <Link to="/capture">
            <Button className="bg-primary text-primary-foreground text-lg px-8 py-5 gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Behavior Table */}
        <div className="bg-muted rounded-lg px-6 py-4 text-xs text-muted-foreground mt-10">
          <p className="font-bold mb-1">System Behavior:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Editing fields → updates session state</li>
            <li>"Continue" → saves prefs, navigates to Capture</li>
            <li>"Skip" → creates default profile, navigates to Capture</li>
            <li>Missing required field → highlights error</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default OnboardingScreen;
