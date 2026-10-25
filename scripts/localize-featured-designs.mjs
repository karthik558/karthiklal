import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const dataPath = path.resolve("public/data/featured-designs.json")
const outputDirectory = path.resolve("public/designs")
const data = JSON.parse(await readFile(dataPath, "utf8"))

await mkdir(outputDirectory, { recursive: true })

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")

for (const [index, design] of data.featuredDesigns.entries()) {
  const sourceUrl = design.sourceImage ?? design.image
  const source = new URL(sourceUrl)
  if (source.protocol !== "https:" || source.hostname !== "mir-s3-cdn-cf.behance.net") {
    throw new Error(`Unsupported image source: ${sourceUrl}`)
  }

  const response = await fetch(source, { headers: { "User-Agent": "KarthikLalPortfolio/1.0" } })
  if (!response.ok) throw new Error(`Failed to download ${sourceUrl}: ${response.status}`)
  const length = Number(response.headers.get("content-length") ?? 0)
  if (length > 20_000_000) throw new Error(`Image is too large: ${sourceUrl}`)

  const input = Buffer.from(await response.arrayBuffer())
  if (input.byteLength > 20_000_000) throw new Error(`Image is too large: ${sourceUrl}`)

  const fileName = `${String(index + 1).padStart(2, "0")}-${slugify(design.title)}.webp`
  await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(outputDirectory, fileName))

  design.sourceImage = sourceUrl
  design.image = `/designs/${fileName}`
  process.stdout.write(`Localized ${index + 1}/${data.featuredDesigns.length}: ${fileName}\n`)
}

await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`)
