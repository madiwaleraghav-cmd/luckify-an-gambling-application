import ScrollExperience from "@/components/ScrollExperience";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LimitsWidget from "@/components/LimitsWidget";

export default function Home() {
  return (
    <main>
      <LimitsWidget />
      <Navbar />
      <ScrollExperience />
      <Footer />
    </main>
  );
}
