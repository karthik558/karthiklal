const { rmSync } = require("node:fs")
const { join } = require("node:path")

// next typegen writes production route types to .next/types. Development route
// types can be stale after framework upgrades and must not affect CI typechecks.
rmSync(join(process.cwd(), ".next", "dev", "types"), {
  recursive: true,
  force: true,
})
