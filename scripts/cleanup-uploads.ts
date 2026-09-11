import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import connectDB from "@/lib/mongodb";
import { MediaAsset } from "@/models";
import { env } from "@/lib/env";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function resolveUploadRoot() {
  return path.resolve(process.cwd(), env.uploadDir);
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");
  const uploadRoot = resolveUploadRoot();

  await connectDB();
  const assets = await MediaAsset.find().select("diskPath metadata.variants").lean();
  const referenced = new Set<string>();

  for (const asset of assets) {
    referenced.add(asset.diskPath.replace(/\\/g, "/"));
    for (const variant of asset.metadata?.variants ?? []) {
      const relative = path.relative(uploadRoot, variant.diskPath).replace(/\\/g, "/");
      referenced.add(relative);
    }
  }

  let allFiles: string[] = [];
  try {
    allFiles = await walk(uploadRoot);
  } catch {
    console.log(`Upload directory not found: ${uploadRoot}`);
    return;
  }

  const orphans: string[] = [];

  for (const absolutePath of allFiles) {
    const ext = path.extname(absolutePath).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const relativePath = path.relative(uploadRoot, absolutePath).replace(/\\/g, "/");
    if (!referenced.has(relativePath)) {
      orphans.push(relativePath);
    }
  }

  console.log(`Mode: ${dryRun ? "dry-run" : "apply"}`);
  console.log(`Referenced files: ${referenced.size}`);
  console.log(`Orphan files: ${orphans.length}`);

  for (const orphan of orphans) {
    console.log(`  - ${orphan}`);
    if (!dryRun) {
      await unlink(path.join(uploadRoot, orphan));
    }
  }

  if (dryRun && orphans.length > 0) {
    console.log("\nRe-run with --apply to delete orphan files.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
