import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, SkipForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const styleOptions = ["Casual", "Formal", "Streetwear", "Athleisure", "Bohemian", "Minimalist", "Vintage"];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [preferredSize, setPreferredSize] = useState("");
  const [fitPreference, setFitPreference] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandInput, setBrandInput] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleStyle = (tag) => {
    setSelectedStyles((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addBrand = (value) => {
    const trimmed = value.trim();
    if (trimmed && !brands.includes(trimmed)) {
      setBrands((prev) => [...prev, trimmed]);
    }
    setBrandInput("");
  };

  const removeBrand = (brand) => {
    setBrands((prev) => prev.filter((b) => b !== brand));
  };

  const handleBrandKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addBrand(brandInput);
    } else if (e.key === "Backspace" && !brandInput && brands.length > 0) {
      setBrands((prev) => prev.slice(0, -1));
    }
  };

  const saveProfile = async (isSkipped) => {
    if (!isSkipped) {
      const newErrors = {};
      if (!preferredSize) newErrors.preferredSize = true;
      if (!fitPreference) newErrors.fitPreference = true;
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setErrors({});
    setSaving(true);
    try {
      const payload = isSkipped
        ? { isSkipped: true }
        : {
            preferredSize,
            fitPreference,
            styleTags: selectedStyles,
            favoriteBrands: brands,
            budgetMin: budgetMin ? Number(budgetMin) : null,
            budgetMax: budgetMax ? Number(budgetMax) : null,
          };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(err?.message || "Failed to save profile. Is the backend running?");
        return;
      }

      navigate("/");
    } finally {
      setSaving(false);
    }
  };
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Set Up Your Style Profile</h1>
          <p className="text-lg text-muted-foreground">Help us learn your preferences to improve predictions.</p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="pt-8 pb-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Preferred Size */}
              <div className="space-y-2">
                <Label className="text-base text-foreground">Preferred Size <span className="text-destructive">*</span></Label>
                <Select value={preferredSize} onValueChange={(v) => { setPreferredSize(v); setErrors((e) => ({ ...e, preferredSize: false })); }}>
                  <SelectTrigger className={`w-full bg-background ${errors.preferredSize ? "border-destructive border-2" : "border-border"}`}>
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
                <Label className="text-base text-foreground">Fit Preference <span className="text-destructive">*</span></Label>
                <Select value={fitPreference} onValueChange={(v) => { setFitPreference(v); setErrors((e) => ({ ...e, fitPreference: false })); }}>
                  <SelectTrigger className={`w-full bg-background ${errors.fitPreference ? "border-destructive border-2" : "border-border"}`}>
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
              <Label className="text-base text-foreground">Style Tags</Label>
              <div className="flex flex-wrap gap-3">
                {styleOptions.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    onClick={() => toggleStyle(tag)}
                    className={`cursor-pointer transition-colors px-4 py-2 text-base ${
                      selectedStyles.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brand Preference */}
            <div className="space-y-2">
              <Label className="text-base text-foreground">Favorite Brands</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-background border border-border rounded-md min-h-[44px] items-center">
                {brands.map((brand) => (
                  <Badge
                    key={brand}
                    className="bg-primary text-primary-foreground px-3 py-1 text-sm gap-1"
                  >
                    {brand}
                    <X
                      className="w-3 h-3 cursor-pointer hover:opacity-70"
                      onClick={() => removeBrand(brand)}
                    />
                  </Badge>
                ))}
                <input
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground"
                  placeholder={brands.length === 0 ? "Type a brand and press Enter..." : ""}
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  onKeyDown={handleBrandKeyDown}
                  onBlur={() => addBrand(brandInput)}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label className="text-base text-foreground">Budget Range</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Min $"
                  type="number"
                  min="0"
                  className="bg-background border-border"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
                <Input
                  placeholder="Max $"
                  type="number"
                  min="0"
                  className="bg-background border-border"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between mt-10 gap-4">
          <Button
            variant="ghost"
            className="text-muted-foreground gap-2 text-base py-5 px-6"
            disabled={saving}
            onClick={() => saveProfile(true)}
          >
            <SkipForward className="w-5 h-5" /> Skip for now
          </Button>
          <Button
            className="bg-primary text-primary-foreground text-xl px-10 py-6 gap-3"
            disabled={saving}
            onClick={() => saveProfile(false)}
          >
            {saving ? "Saving…" : "Continue"} <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </PageLayout>
  );
};

export default OnboardingScreen;
