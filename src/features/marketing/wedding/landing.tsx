import WeddingHeader from "./header";
import WeddingHero from "./hero";
import WeddingFeatures from "./features";
import WeddingFooter from "./footer";
export default function WeddingLanding() {
  return (
    <main className="site wedding">
      <WeddingHeader />
      <WeddingHero />
      <WeddingFeatures />
      <WeddingFooter />
    </main>
  );
}
