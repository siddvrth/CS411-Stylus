import { Link } from "react-router-dom";
import { Camera, Upload, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const features = [
  {
    to: "/capture",
    icon: Camera,
    title: "Capture Item",
    desc: "Take a photo or upload an image of a clothing item to analyze.",
  },
  {
    to: "/item-details",
    icon: Upload,
    title: "Item Details",
    desc: "Enter item metadata like brand, size, and material.",
  },
  {
    to: "/results",
    icon: History,
    title: "View Results",
    desc: "See return-risk predictions and provide feedback.",
  },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Will you keep it or return it?
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Stylus helps you predict whether a clothing item is worth keeping — saving you money, time, and reducing waste.
        </p>
        <Link to="/onboarding">
          <Button className="bg-primary text-primary-foreground text-lg px-8 py-6 gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-8 pb-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
