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
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl font-bold text-foreground mb-6">
          Will you keep it or return it?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Stylus helps you predict whether a clothing item is worth keeping — saving you money, time, and reducing waste.
        </p>
        <Link to="/onboarding">
          <Button className="bg-primary text-primary-foreground text-xl px-10 py-7 gap-3">
            Get Started <ArrowRight className="w-6 h-6" />
          </Button>
        </Link>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-10 pb-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                  <p className="text-base text-muted-foreground">{desc}</p>
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
