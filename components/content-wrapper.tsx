import type { ReactNode } from "react"

export default function ContentWrapper({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>
}
