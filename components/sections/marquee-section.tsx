import { MarqueeAnimation } from "@/components/ui/marquee-effect"

export default function MarqueeSection() {
  return (
    <section className="capabilities-marquee" aria-label="Core capabilities">
      <div className="capabilities-marquee-track capabilities-marquee-top">
        <MarqueeAnimation direction="left" baseVelocity={1.5} className="capabilities-primary">
          {"Built with intention • Secured with care • Designed to make a difference • Systems you can trust •"}
        </MarqueeAnimation>
      </div>
      <div className="capabilities-marquee-track capabilities-marquee-bottom">
        <MarqueeAnimation direction="right" baseVelocity={1.2} className="capabilities-secondary">
          {"Curious thinking • Clear mind • Thoughtful details • Always exploring •"}
        </MarqueeAnimation>
      </div>
    </section>
  )
}
