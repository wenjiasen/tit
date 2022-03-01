import path from 'path';
import process from 'process';
import fs from 'fs';
import { Application } from '../';
import appRootPath from 'app-root-path';

export function getMainDir(): string {
  const mainModule = require.main || process.mainModule;
  if (!mainModule) throw "Can't find main module";
  return path.dirname(mainModule.filename);
}

export function getSourceRoot(): string {
  return appRootPath.path;
}

export function walkDirectory(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
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

export function newModule<T>(filepath: string, app: Application): T {
  const mod = module.require(filepath);
  if (mod.__esModule) {
    let modConstructor = mod.default;
    if (!modConstructor) {
      const name = Object.getOwnPropertyNames(mod).find((n: string) => (/controller$/ig.test(n)));
      if (!name) {
        throw new Error(`Can't load controller file [${filepath}]. Not found module constructor. Please check module has default export or Controller class like 'IndexController'`);
      }
      modConstructor = mod[name];
    }
    return new modConstructor(app);
  }
  if (mod.constructor) return new mod(app);
  throw Error(`Invalid Module: ${filepath}`);
}
