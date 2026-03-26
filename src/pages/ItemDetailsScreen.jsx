import { Link } from "react-router-dom";
import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const ItemDetailsScreen = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Item Details</h1>
          <p className="text-muted-foreground">Confirm or edit the detected item information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Preview */}
          <Card className="border-border bg-card md:col-span-1">
            <CardContent className="pt-6">
              <div className="w-full aspect-square rounded-xl border-2 border-dashed border-secondary flex items-center justify-center bg-muted">
                <div className="text-center space-y-2">
                  <Camera className="w-10 h-10 text-secondary mx-auto" />
                  <p className="text-muted-foreground text-xs">Captured item preview</p>
                </div>
              </div>
              <Link to="/capture" className="block mt-4">
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="w-4 h-4" /> Retake Photo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="border-border bg-card md:col-span-2">
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="e.g. Tops, Bottoms..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Brand</Label>
                  <Input placeholder="Enter brand..." className="bg-background border-border" />
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Size</Label>
                  <Input placeholder="M" className="bg-background border-border" />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Price</Label>
                  <Input placeholder="$49.99" className="bg-background border-border" />
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Material</Label>
                  <Input placeholder="Cotton, Polyester..." className="bg-background border-border" />
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Color</Label>
                  <Input placeholder="Blue" className="bg-background border-border" />
                </div>
              </div>

              {/* Occasion full width */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Occasion</Label>
                <Input placeholder="Casual" className="bg-background border-border" />
              </div>

              <Link to="/results">
                <Button className="w-full bg-primary text-primary-foreground text-lg py-5 gap-2 mt-2">
                  <Search className="w-5 h-5" /> Analyze Return Risk
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Behavior Table */}
        <div className="bg-muted rounded-lg px-6 py-4 text-xs text-muted-foreground mt-10">
          <p className="font-bold mb-1">System Behavior:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Editing fields → updates local item metadata, validates in real time</li>
            <li>"Analyze Return Risk" → sends profile + item data to analysis, navigates to Results</li>
            <li>"Retake Photo" → reopens camera, preserves entered details</li>
            <li>Analysis fails → displays error, allows retry</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default ItemDetailsScreen;
