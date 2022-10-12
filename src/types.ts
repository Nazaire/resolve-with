export type Node<T, Relations extends {}> = {
  value: T;
} & Relations;

export type ResolvedValues<O extends {}> = {
  [P in keyof O]: O[P] extends Promise<infer I> ? I : O[P];
};
