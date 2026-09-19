import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import ContactGuestbook from "@/components/ContactGuestbook";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-28 lg:space-y-36">
        <Hero />
        <TechStack />
        <PortfolioShowcase />
        <ContactGuestbook />
      </main>
      <Footer />
    </>
  );
}
