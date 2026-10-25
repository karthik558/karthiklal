import { useEffect, useState } from "react"

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("")
  const sectionKey = sectionIds.join("|")

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const ids = sectionKey.split("|").filter(Boolean)
      const anchor = window.innerHeight * 0.32
      let active = ""
      let nearestAbove = Number.NEGATIVE_INFINITY
      let nearestDistance = Number.POSITIVE_INFINITY

      ids.forEach(id => {
        const element = document.getElementById(id)
        if (!element) return
        const top = element.getBoundingClientRect().top

        if (top <= anchor && top > nearestAbove) {
          nearestAbove = top
          active = id
        } else if (!active && Math.abs(top - anchor) < nearestDistance) {
          nearestDistance = Math.abs(top - anchor)
          active = id
        }
      })

      setActiveSection(current => current === active ? current : active)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })
    const contentObserver = new MutationObserver(scheduleUpdate)
    contentObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      contentObserver.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [sectionKey])

  return activeSection
}
