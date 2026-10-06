import GeneralHeader from "./header";
import GeneralHero from "./hero";
import GeneralMarquee from "./marquee";
import GeneralOccasions from "./occasions";
import GeneralHow from "./how";
import GeneralFooter from "./footer";
export default function GeneralLanding() {
  return (
    <main className="party-site">
      <GeneralHeader />
      <GeneralHero />
      <GeneralMarquee />
      <GeneralOccasions />
      <GeneralHow />
      <GeneralFooter />
    </main>
  );
}
