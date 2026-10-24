import SectionHeading from "@/components/sections/section-heading"
import { ArrowUpRight, Gauge, ScanEye, ShieldCheck } from "lucide-react"
const principles = [
  { title: "Make it clear", text: "Start with the person on the other side of the screen. Give every element a purpose, and every interaction a clear next step.", icon: ScanEye, detail: "CLARITY / ACCESSIBILITY" },
  { title: "Build in trust", text: "Think about what can go wrong before it does. Secure defaults and dependable foundations are part of the design from day one.", icon: ShieldCheck, detail: "SECURITY / RESILIENCE" },
  { title: "Keep it fast", text: "Respect people’s time and devices. Build lean, test the real experience, and refine the details that make everyday use feel effortless.", icon: Gauge, detail: "PERFORMANCE / PRECISION" },
]
export default function PrinciplesSection() {
  return <section id="principles" className="section-shell studio-principles">
    <div className="section-container">
      <div className="section-heading-row"><div>
            <SectionHeading number="02" label="THE APPROACH" title="Good work." accent="By design." /></div><p className="studio-section-intro">Different disciplines. The same attention to detail.<br />These are the principles behind everything I build.</p></div>
      <div className="principle-grid">{principles.map(({title,text,icon:Icon,detail},i) => <article key={title}><div className="principle-top"><span>0{i+1}</span><Icon size={26} strokeWidth={1.3}/></div><div className={`principle-mark principle-mark-${i}`} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><p>{text}</p><footer>{detail}<ArrowUpRight size={16}/></footer></article>)}</div>
      <p className="principle-footnote"><span>THE PROCESS</span> Understand → Design → Build → Test → Refine</p>
    </div>
  </section>
}
