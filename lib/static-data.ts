import profileJson from "@/public/data/profile.json"
import socialsJson from "@/public/data/socials.json"
import certificationsJson from "@/public/data/certifications.json"

export const PROFILE_DATA = profileJson
export const SOCIALS_DATA = socialsJson
export const CERTIFICATIONS_DATA = certificationsJson

export type ProfileData = typeof PROFILE_DATA
export type SocialsData = typeof SOCIALS_DATA

export function getBehanceUrl(fallback: string = "#") {
  const behance = SOCIALS_DATA.socials?.find(
    (social) => social.name.toLowerCase() === "behance"
  )

  return behance?.url ?? fallback
}
