import { Link, useLocation } from "react-router-dom";
import { Camera, Upload, History, Settings, Home, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/onboarding", label: "Preferences", icon: Settings },
  { to: "/capture", label: "Capture", icon: Camera },
  { to: "/item-details", label: "Item Details", icon: Upload },
  { to: "/results", label: "Results", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/stylus-logo.jpg" alt="Stylus" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-2xl font-bold text-primary tracking-wide">Stylus</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-base transition-colors ${
                  active
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
