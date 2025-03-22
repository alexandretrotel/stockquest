import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
