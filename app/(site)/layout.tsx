import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Public-site chrome (navbar, footer, skip link) around every non-admin route. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
