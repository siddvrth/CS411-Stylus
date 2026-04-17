import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import {
  ensureItemSessionId,
  fetchLatestProfile,
  getItemImageUrl,
  postItemConfirm,
  postItemPredict,
  setLastPrediction,
} from "@/lib/item-flow";

const categories = ["Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"];

const ItemDetailsScreen = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setPreview(getItemImageUrl());
  }, []);

  const parsePrice = () => {
    const t = price.trim().replace(/^\$/, "");
    if (!t) return undefined;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : NaN;
  };

  const submit = async () => {
    setFieldErrors({});
    const priceNum = parsePrice();
    const errors = {};
    if (!category) errors.category = "Choose a category.";
    if (!size.trim()) errors.size = "Size is required.";
    if (price.trim() && Number.isNaN(priceNum)) errors.price = "Enter a valid price.";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const itemDetails = {
      category,
      brand: brand.trim(),
      size: size.trim(),
      material: material.trim(),
      color: color.trim(),
      style: occasion.trim() || "casual",
    };
    if (priceNum !== undefined) itemDetails.price = priceNum;

    setBusy(true);
    try {
      const sessionId = ensureItemSessionId();
      await postItemConfirm(sessionId, itemDetails);
      const { profile } = await fetchLatestProfile();
      const prediction = await postItemPredict(sessionId, profile);
      setLastPrediction(prediction);
      navigate("/results");
    } catch (e) {
      if (e.fieldErrors) setFieldErrors(e.fieldErrors);
      else alert(e.message || "Could not analyze this item.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Item Details</h1>
          <p className="text-lg text-muted-foreground">Confirm or edit the detected item information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border bg-card md:col-span-1">
            <CardContent className="pt-6">
              <div className="w-full aspect-square rounded-xl border-2 border-dashed border-secondary overflow-hidden bg-muted flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Item" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center space-y-2 p-4">
                    <Camera className="w-12 h-12 text-secondary mx-auto" />
                    <p className="text-muted-foreground text-sm">No image yet — upload from capture.</p>
                  </div>
                )}
              </div>
              <Link to="/capture" className="block mt-4">
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="w-4 h-4" /> Retake Photo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-card md:col-span-2">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base text-foreground">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      className={`bg-background ${fieldErrors.category ? "border-destructive border-2" : "border-border"}`}
                    >
                      <SelectValue placeholder="e.g. Tops, Bottoms..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.category && (
                    <p className="text-sm text-destructive">{fieldErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-foreground">Brand</Label>
                  <Input
                    placeholder="Enter brand..."
                    className="bg-background border-border"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-foreground">Size</Label>
                  <Input
                    placeholder="M"
                    className={`bg-background ${fieldErrors.size ? "border-destructive border-2" : "border-border"}`}
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                  {fieldErrors.size && <p className="text-sm text-destructive">{fieldErrors.size}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-foreground">Price</Label>
                  <Input
                    placeholder="$49.99"
                    className={`bg-background ${fieldErrors.price ? "border-destructive border-2" : "border-border"}`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {fieldErrors.price && <p className="text-sm text-destructive">{fieldErrors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-foreground">Material</Label>
                  <Input
                    placeholder="Cotton, Polyester..."
                    className="bg-background border-border"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-foreground">Color</Label>
                  <Input
                    placeholder="Blue"
                    className="bg-background border-border"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base text-foreground">Occasion</Label>
                <Input
                  placeholder="Casual"
                  className="bg-background border-border"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                />
              </div>

              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground text-xl py-6 gap-3 mt-2"
                disabled={busy}
                onClick={submit}
              >
                <Search className="w-6 h-6" /> {busy ? "Analyzing…" : "Analyze Return Risk"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ItemDetailsScreen;
