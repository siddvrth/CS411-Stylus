import { Link } from "react-router-dom";
import { Camera, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const CaptureScreen = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Capture Item</h1>
          <p className="text-lg text-muted-foreground">Take a photo or upload an image of the clothing item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Camera Viewfinder */}
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-secondary flex items-center justify-center bg-muted">
                <div className="text-center space-y-3">
                  <Camera className="w-20 h-20 text-secondary mx-auto" />
                  <p className="text-muted-foreground text-base">Camera viewfinder area</p>
                  <p className="text-sm text-muted-foreground">Point at a clothing item</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Panel */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Options</h2>
                <Link to="/item-details">
                  <Button className="w-full bg-primary text-primary-foreground text-xl py-6 gap-3">
                    <Camera className="w-6 h-6" /> Take Photo
                  </Button>
                </Link>
                <Link to="/item-details">
                  <Button variant="outline" className="w-full text-xl py-6 gap-3 mt-2">
                    <Upload className="w-6 h-6" /> Upload Image
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Link to="/results">
              <Button variant="ghost" className="gap-2 text-muted-foreground text-base py-5">
                <History className="w-5 h-5" /> View History
              </Button>
            </Link>


          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CaptureScreen;
