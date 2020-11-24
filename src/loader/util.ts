import appRootPath from 'app-root-path';
import path from 'path';
import fs from 'fs';

export function getSourceRoot(): string {
  let dir = './src';
  if (process.env.NODE_ENV === 'production') {
    dir = './dist';
  }
  return path.resolve(appRootPath.path, dir);
}

export function walkDirectory(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDirectory(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
