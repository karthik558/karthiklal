"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [exiting, setExiting] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const reveal = window.setTimeout(() => setExiting(true), reduced ? 180 : 650)
    const complete = window.setTimeout(() => onComplete?.(), reduced ? 220 : 1250)
    return () => { window.clearTimeout(reveal); window.clearTimeout(complete) }
  }, [onComplete, reduced])
  return <AnimatePresence>{!exiting && <motion.div className="editorial-preloader" role="status" aria-label="Loading website" initial={{opacity:1}} exit={reduced ? {opacity:0} : {y:"-100%"}} transition={{duration:reduced ? .04 : .6,ease:[.76,0,.24,1]}}>
    <div className="preloader-rule"><span>KARTHIK LAL</span><span>SELECTED WORKS</span></div>
    <div className="preloader-title"><span className="studio-label">A PERSONAL COLLECTION</span><p>Built with purpose.<br /><span className="studio-serif">Made with care.</span></p><div className="preloader-line" aria-hidden="true"><span /></div></div>
    <div className="preloader-rule"><span>SECURITY / DEVELOPMENT / DESIGN</span><span>OPENING THE COLLECTION ↗</span></div>
  </motion.div>}</AnimatePresence>
}
