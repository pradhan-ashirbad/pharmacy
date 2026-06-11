import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CompareBar } from "@/components/product/compare-bar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
    </div>
  );
}
