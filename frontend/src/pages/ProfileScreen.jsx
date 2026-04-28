import { useState, useEffect } from "react";
import { User, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fits = ["Slim", "Regular", "Relaxed", "Oversized"];
const styleOptions = ["Casual", "Formal", "Streetwear", "Athleisure", "Bohemian", "Minimalist", "Vintage"];

const ProfileScreen = () => {
  const [preferredSize, setPreferredSize] = useState("");
  const [fitPreference, setFitPreference] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandInput, setBrandInput] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          const p = data.profile;
          setPreferredSize(p.preferredSize || "");
          setFitPreference(p.fitPreference || "");
          setSelectedStyles(p.styleTags || []);
          setBrands(p.favoriteBrands || []);
          setBudgetMin(p.budgetMin != null ? String(p.budgetMin) : "");
          setBudgetMax(p.budgetMax != null ? String(p.budgetMax) : "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      preferredSize,
      fitPreference,
      styleTags: selectedStyles,
      favoriteBrands: brands,
      budgetMin: budgetMin ? Number(budgetMin) : null,
      budgetMax: budgetMax ? Number(budgetMax) : null,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile saved!");
      } else {
        toast.error("Failed to save profile.");
      }
    } finally {
      setSaving(false);
    }
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

  return (
    <PageLayout>
      <section className="max-w-2xl mx-auto px-8 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Preferences</h1>
            <p className="text-muted-foreground text-base">
              Manage your style preferences and budget.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading profile…</p>
        ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Size & Fit */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Size &amp; Fit</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Preferred Size</Label>
                <Select value={preferredSize} onValueChange={setPreferredSize}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fit">Fit Preference</Label>
                <Select value={fitPreference} onValueChange={setFitPreference}>
                  <SelectTrigger id="fit">
                    <SelectValue placeholder="Select fit" />
                  </SelectTrigger>
                  <SelectContent>
                    {fits.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Style & Brands */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Style &amp; Brands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="styles">Style Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      onClick={() =>
                        setSelectedStyles((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )
                      }
                      className={`cursor-pointer transition-colors px-3 py-1.5 text-sm ${
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

              <div className="space-y-2">
                <Label htmlFor="brands">Favorite Brands</Label>
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
                    id="brands"
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground"
                    placeholder={brands.length === 0 ? "Type a brand and press Enter..." : ""}
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    onKeyDown={handleBrandKeyDown}
                    onBlur={() => addBrand(brandInput)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Budget Range</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Min ($)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Max ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  min="0"
                  placeholder="500"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={saving} className="gap-3 text-lg px-8 py-5">
              <Save className="w-5 h-5" />
              {saving ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </form>
        )}
      </section>
    </PageLayout>
  );
};

export default ProfileScreen;
