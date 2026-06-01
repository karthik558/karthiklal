const fs = require('fs');
const path = require('path');

// Check if we are running in a Cloudflare Pages or Vercel environment
if (process.env.CF_PAGES || process.env.VERCEL) {
  console.log("☁️ Production cloud environment detected.");
  console.log("🔒 Disabling local CMS Admin routes to prevent Edge Runtime build errors...");

  const adminPageDir = path.join(__dirname, '../app/admin');
  const adminApiDir = path.join(__dirname, '../app/api/admin');
  
  // By renaming the directories to start with an underscore, 
  // Next.js App Router completely ignores them during the build process.
  if (fs.existsSync(adminPageDir)) {
    fs.renameSync(adminPageDir, path.join(__dirname, '../app/_admin'));
    console.log("✅ Disabled /app/admin -> /app/_admin");
  }
  
  if (fs.existsSync(adminApiDir)) {
    fs.renameSync(adminApiDir, path.join(__dirname, '../app/api/_admin'));
    console.log("✅ Disabled /app/api/admin -> /app/api/_admin");
  }

  console.log("🚀 Admin dashboard successfully removed from production build. Your local CMS is safe!");
} else {
  console.log("💻 Local development environment detected. Admin dashboard remains active.");
}
