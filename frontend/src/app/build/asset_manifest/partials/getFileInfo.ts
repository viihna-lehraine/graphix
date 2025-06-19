import fs from 'fs';
import crypto from 'crypto';

export async function getFileInfo(filePath: string): Promise<{
  size_kb: number;
  hash_sha256: string;
}> {
  const stat = fs.statSync(filePath);
  const size_kb = Math.round(stat.size / 1024);
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  return { size_kb, hash_sha256: hash };
}
