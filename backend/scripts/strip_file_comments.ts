// File: backend/scripts/strip_file_comments.ts

import fs from 'fs';
import path from 'path';

function stripCommentsRecursively(dir: string): void {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      stripCommentsRecursively(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/^\/\/\s*File:.*$/gm, '');
      fs.writeFileSync(fullPath, content);
    }
  }
}

const targetDir = path.resolve('src_tmp');

fs.cpSync('src', targetDir, { recursive: true });
stripCommentsRecursively(targetDir);

console.log(`Comments stripped to target directory ${targetDir}`);
