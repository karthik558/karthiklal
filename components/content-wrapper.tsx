import type { ReactNode } from "react"

export default function ContentWrapper({ children }: { children: ReactNode }) {
  return <div className="public-page-frame w-full">{children}</div>
}
