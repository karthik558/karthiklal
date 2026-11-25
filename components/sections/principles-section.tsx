import SectionHeading from "@/components/sections/section-heading"
const principles = [
  { title: "Make it clear", text: "Start with the person on the other side of the screen. Give every element a purpose, and every interaction a clear next step." },
  { title: "Build in trust", text: "Think about what can go wrong before it does. Secure defaults and dependable foundations are part of the design from day one." },
  { title: "Keep it fast", text: "Respect people’s time and devices. Build lean, test the real experience, and refine the details that make everyday use feel effortless." },
]
export default function PrinciplesSection() {
  return <section id="principles" className="section-shell studio-principles">
    <div className="section-container">
      <div className="section-heading-row"><div>
            <SectionHeading title="Good work." accent="By design." /></div></div>
      <div className="principle-grid">{principles.map(({title,text},i) => <article key={title}><div className="principle-top"><span>0{i+1}</span></div><div className={`principle-mark principle-mark-${i}`} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      <p className="principle-footnote"><span>THE PROCESS</span> Understand → Design → Build → Test → Refine</p>
    </div>
  </section>
}
