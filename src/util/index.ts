export const isProductionModel = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function map2Array(obj: Record<number, any>): any[] {
  const keys = Object.getOwnPropertyNames(obj);
  return keys
    .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    .map((n) => {
      return obj[Number.parseInt(n)];
    });
}

export function isObject(object: Record<string, any>): boolean {
  try {
    const keys = Reflect.ownKeys(object);
    return !!keys.length;
  } catch (error) {
    return false;
  }
}

export function filterNullOrUndefinedProperty(params: unknown): any {
  if (params && isObject(params)) {
    const data: Record<string, any> = {};
    Reflect.ownKeys(params as Record<string, any>).forEach((name) => {
      let temp = (params as Record<string, any>)[name as string];
      if (temp !== null && temp !== undefined) {
        if (Array.isArray(temp)) {
          temp = temp.map((i) => filterNullOrUndefinedProperty(i));
        } else if (isObject(temp)) {
          temp = filterNullOrUndefinedProperty(temp);
        }
        // 判断
        data[name as string] = temp;
      }
    });
    return data;
  } else {
    return params;
  }
}

/**
 * 将对象的素有属性名转为全小写
 * @param query
 */
export function lowerCaseObjectProperties(query: unknown): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const name of Object.getOwnPropertyNames(query)) {
    result[name.toLowerCase()] = (query as Record<string, unknown>)[name];
  }
  return result;
}
