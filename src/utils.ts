export const isNil = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  return false;
};

export type Exclude<T, U> = T extends U ? never : T;

export const isPromise = (p: any) => {
  if (!p) return false;
  
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }

  return false;
};
