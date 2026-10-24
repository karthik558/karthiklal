import { MarqueeAnimation } from "@/components/ui/marquee-effect"

export default function MarqueeSection() {
  return (
    <section
      aria-label="Core capabilities"
      className="capabilities-marquee relative w-full overflow-hidden bg-transparent py-4 my-0"
    >
      <div className="relative z-10 flex flex-col gap-3">
        <div className="capabilities-marquee-track capabilities-marquee-top -ml-[1vw] w-[102vw] origin-center -rotate-[0.65deg] transition-transform duration-500 hover:rotate-0">
          <MarqueeAnimation
            direction="left"
            baseVelocity={2.2}
            className="capabilities-primary bg-foreground py-3 font-mono text-xl font-black uppercase tracking-tight text-background shadow-xl sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
          >
            {"CYBERSECURITY • FULL STACK DEVELOPMENT • NETWORK SECURITY • PENETRATION TESTING • SYSTEM ARCHITECTURE • HOTEL IT INFRASTRUCTURE •"}
          </MarqueeAnimation>
        </div>

        <div className="capabilities-marquee-track capabilities-marquee-bottom -ml-[1vw] w-[102vw] origin-center rotate-[0.65deg] transition-transform duration-500 hover:rotate-0">
          <MarqueeAnimation
            direction="right"
            baseVelocity={1.8}
            className="capabilities-secondary bg-card py-3 font-mono text-xl font-black uppercase tracking-tight text-foreground shadow-lg ring-1 ring-border/60 sm:text-2xl md:py-4 md:text-3xl lg:text-4xl"
          >
            {"Curious thinking • Clear mind • Thoughtful details • Always exploring • Threat mitigation • Cloud ops •"}
          </MarqueeAnimation>
        </div>
      </div>
    </section>
  )
}
