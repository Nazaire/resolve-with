export const isNil = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  return false;
};

export type Exclude<T, U> = T extends U ? never : T;

export const isPromise = (p: any) => {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }

  return false;
};

export type Node<T, Relations extends {}> = {
  value: T;
} & Relations;

export type ResolvedValues<O extends {}> = {
  [P in keyof O]: O[P] extends Promise<infer I> ? I : O[P];
};
