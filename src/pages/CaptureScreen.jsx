import { Link } from "react-router-dom";
import { Camera, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const CaptureScreen = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Capture Item</h1>
          <p className="text-muted-foreground">Take a photo or upload an image of the clothing item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Camera Viewfinder */}
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-secondary flex items-center justify-center bg-muted">
                <div className="text-center space-y-3">
                  <Camera className="w-16 h-16 text-secondary mx-auto" />
                  <p className="text-muted-foreground text-sm">Camera viewfinder area</p>
                  <p className="text-xs text-muted-foreground">Point at a clothing item</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Panel */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Options</h2>
                <Link to="/item-details">
                  <Button className="w-full bg-primary text-primary-foreground text-lg py-5 gap-2">
                    <Camera className="w-5 h-5" /> Take Photo
                  </Button>
                </Link>
                <Link to="/item-details">
                  <Button variant="outline" className="w-full text-lg py-5 gap-2 mt-2">
                    <Upload className="w-5 h-5" /> Upload Image
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Link to="/results">
              <Button variant="ghost" className="gap-2 text-muted-foreground">
                <History className="w-5 h-5" /> View History
              </Button>
            </Link>

            {/* Behavior Table */}
            <div className="bg-muted rounded-lg px-6 py-4 text-xs text-muted-foreground">
              <p className="font-bold mb-1">System Behavior:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>"Take Photo" → activates camera, captures image, goes to Item Details</li>
                <li>"Upload Image" → opens file picker, validates, goes to Item Details</li>
                <li>Camera denied → disables camera, shows permission message</li>
                <li>"History" → retrieves saved analyses, goes to History</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CaptureScreen;
