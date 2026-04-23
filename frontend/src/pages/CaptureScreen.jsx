import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import {
  ensureItemSessionId,
  postItemUpload,
  setItemImageUrl,
} from "@/lib/item-flow";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const CaptureScreen = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const runUpload = (file) => {
    if (!file || busy) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Image must be 5 MB or smaller.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageUrl = reader.result;
        const sessionId = ensureItemSessionId();
        await postItemUpload(sessionId, imageUrl);
        setItemImageUrl(imageUrl);
        navigate("/item-details");
      } catch (e) {
        alert(e.message || "Upload failed.");
      } finally {
        setBusy(false);
      }
    };
    reader.onerror = () => {
      setBusy(false);
      alert("Could not read that file.");
    };
    reader.readAsDataURL(file);
  };

  const openPicker = (capture) => {
    const el = fileRef.current;
    if (!el) return;
    el.accept = "image/jpeg,image/png,image/webp,image/gif";
    el.multiple = false;
    if (capture) el.setAttribute("capture", capture);
    else el.removeAttribute("capture");
    el.click();
  };

  return (
    <PageLayout>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          runUpload(file);
        }}
      />
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Capture Item</h1>
          <p className="text-lg text-muted-foreground">Take a photo or upload an image of the clothing item.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Options</h2>
                <Button
                  type="button"
                  className="w-full bg-primary text-primary-foreground text-xl py-6 gap-3"
                  disabled={busy}
                  onClick={() => openPicker("environment")}
                >
                  <Camera className="w-6 h-6" /> Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xl py-6 gap-3 mt-2"
                  disabled={busy}
                  onClick={() => openPicker("")}
                >
                  <Upload className="w-6 h-6" /> Upload Image
                </Button>
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
