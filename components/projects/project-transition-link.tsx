"use client"

import type { CSSProperties, MouseEvent, ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => {
    finished: Promise<void>
    ready: Promise<void>
    updateCallbackDone: Promise<void>
  }
}

type Props = {
  href: string
  projectId: number
  children: ReactNode
  className?: string
  ariaLabel?: string
  shareElement?: boolean
}

export default function ProjectTransitionLink({
  href,
  projectId,
  children,
  className,
  ariaLabel,
  shareElement = true,
}: Props) {
  const router = useRouter()

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const documentWithTransitions = document as ViewTransitionDocument
    if (!documentWithTransitions.startViewTransition) return

    event.preventDefault()
    try {
      const transition = documentWithTransitions.startViewTransition(async () => {
        router.push(href)
        await new Promise<void>((resolve) => window.setTimeout(resolve, 120))
      })
      void Promise.allSettled([
        transition.ready,
        transition.updateCallbackDone,
        transition.finished,
      ])
    } catch {
      router.push(href)
    }
  }

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={ariaLabel}
      onClick={navigate}
      className={className}
      style={shareElement ? ({ viewTransitionName: `project-${projectId}` } as CSSProperties) : undefined}
    >
      {children}
    </Link>
  )
}
