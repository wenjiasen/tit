import fs from 'fs';
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
