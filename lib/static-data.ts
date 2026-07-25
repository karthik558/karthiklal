import profileJson from "@/public/data/profile.json"
import socialsJson from "@/public/data/socials.json"
import certificationsJson from "@/public/data/certifications.json"

export const PROFILE_DATA = profileJson
export const SOCIALS_DATA = socialsJson
export const CERTIFICATIONS_DATA = certificationsJson
const publicSocialNames = ["GitHub", "LinkedIn", "Instagram", "Facebook", "X", "Behance"]

export const PUBLIC_SOCIAL_LINKS = SOCIALS_DATA.socials
  .filter((social) => publicSocialNames.includes(social.name))
  .map((social) => ({
    name: social.name === "X" ? "X / TWITTER" : social.name.toUpperCase(),
    href: social.url,
  }))

export type ProfileData = typeof PROFILE_DATA
export type SocialsData = typeof SOCIALS_DATA

export function getBehanceUrl(fallback: string = "#") {
  const behance = SOCIALS_DATA.socials?.find(
    (social) => social.name.toLowerCase() === "behance"
  )

  return behance?.url ?? fallback
}
