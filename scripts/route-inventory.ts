import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const roots = ["src/pages", "src/routing"].filter((p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
});

const files: string[] = [];

function walk(d: string) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else files.push(p);
  }
}

roots.forEach(walk);

const routes = files
  .filter((f) => /router|pages/i.test(f) && /\.(tsx|ts)$/.test(f))
  .map((f) => `- ${f}`)
  .join("\n");

writeFileSync("docs/ROUTES.md", `# Routes\n\n${routes}\n`);
console.log("Wrote docs/ROUTES.md");
