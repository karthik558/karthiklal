"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  title: string
  excerpt: string
}

export function ShareButton({ title, excerpt }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title,
      text: excerpt,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error)
        toast.error("Failed to share")
      }
    }
  }

  return (
    <Button
      variant="outline"
      className="border-2 border-border bg-card hover:border-foreground text-foreground font-bold px-6 py-3"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" /> SHARE ARTICLE
    </Button>
  )
}
