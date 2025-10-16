import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const envs = new Set<string>();

function scan(dir: string) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory() && f !== 'node_modules' && !f.startsWith('.')) {
      scan(p);
    } else if (/\.[tj]sx?$/.test(f)) {
      const content = readFileSync(p, 'utf8');
      for (const m of content.matchAll(/import\.meta\.env\.([A-Z0-9_]+)/g)) {
        envs.add(m[1]);
      }
    }
  }
}

scan('.');
console.log([...envs].sort().join('\n'));

