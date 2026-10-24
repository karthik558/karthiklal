import { MarqueeAnimation } from "@/components/ui/marquee-effect"

export default function MarqueeSection() {
  return (
    <section className="capabilities-marquee" aria-label="Core capabilities">
      <div className="capabilities-marquee-track">
        <MarqueeAnimation direction="left" baseVelocity={1.6} className="capabilities-primary">
          {"Built with intention • Secured with care • Designed to make a difference •"}
        </MarqueeAnimation>
      </div>
      <div className="capabilities-marquee-track">
        <MarqueeAnimation direction="right" baseVelocity={1.3} className="capabilities-secondary">
          {"CURIOUS MIND • CLEAR THINKING • THOUGHTFUL DETAILS • ALWAYS EXPLORING •"}
        </MarqueeAnimation>
      </div>
    </section>
  )
}
