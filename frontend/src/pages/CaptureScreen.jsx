import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
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
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  const runUpload = (file) => {
    if (!file || busy) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageUrl = reader.result;
        setPreview(imageUrl);
        const sessionId = ensureItemSessionId();
        await postItemUpload(sessionId, imageUrl);
        setItemImageUrl(imageUrl);
        navigate("/item-details");
      } catch (e) {
        toast.error(e.message || "Upload failed.");
        setPreview("");
      } finally {
        setBusy(false);
      }
    };
    reader.onerror = () => {
      setBusy(false);
      toast.error("Could not read that file.");
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) runUpload(file);
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
      <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Capture Item</h1>
          <p className="text-muted-foreground text-base">
            Take a photo or upload an image of the clothing item.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`w-full aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center bg-muted transition-colors overflow-hidden ${
            dragging ? "border-primary bg-primary/10" : "border-primary/25 hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
          } ${busy ? "opacity-60 pointer-events-none" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !busy && openPicker("")}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-3 p-6 pointer-events-none">
              <Camera className="w-16 h-16 text-primary/50 mx-auto" />
              <p className="text-muted-foreground text-sm">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — max 5 MB</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            type="button"
            className="w-full bg-primary text-primary-foreground text-base py-5 gap-2"
            disabled={busy}
            onClick={() => openPicker("environment")}
          >
            <Camera className="w-5 h-5" /> {busy ? "Uploading…" : "Scan Item"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full text-base py-5 gap-2"
            disabled={busy}
            onClick={() => openPicker("")}
          >
            <Upload className="w-5 h-5" /> Upload from Gallery
          </Button>
        </div>

        <Link to="/history">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <History className="w-4 h-4" /> View History
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default CaptureScreen;
