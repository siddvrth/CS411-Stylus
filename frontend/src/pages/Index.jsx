import { Link } from "react-router-dom";
import { Camera, Upload, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";

const steps = [
  {
    to: "/capture",
    icon: Camera,
    step: 1,
    title: "Capture Item",
    desc: "Take a photo or upload an image of a clothing item to analyze.",
    iconCls: "bg-blue-100 text-blue-600",
    numCls: "bg-blue-600 text-white",
  },
  {
    to: "/item-details",
    icon: Upload,
    step: 2,
    title: "Add Details",
    desc: "Enter item metadata like brand, size, and material for a better prediction.",
    iconCls: "bg-primary/20 text-primary",
    numCls: "bg-primary text-white",
  },
  {
    to: "/results",
    icon: History,
    step: 3,
    title: "Get Results",
    desc: "See your return-risk prediction and save it to your history.",
    iconCls: "bg-green-100 text-green-600",
    numCls: "bg-green-600 text-white",
  },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-8 py-24 text-center overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-16 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            Will you keep it or{" "}
            <span className="text-primary">return it?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Stylus predicts whether a clothing item is worth keeping — saving you money, time, and reducing returns.
          </p>
          <Link to="/capture">
            <Button className="bg-primary text-primary-foreground text-xl px-12 py-7 gap-3 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200">
              Start Scanning <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-semibold text-center text-foreground mb-10">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ to, icon: Icon, step, title, desc, iconCls, numCls }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <CardContent className="pt-10 pb-8 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconCls}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${numCls}`}>
                      {step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
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
