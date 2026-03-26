import Navbar from "./Navbar";
import Footer from "./Footer";

const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
