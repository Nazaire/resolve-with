import { isNil } from "./utils";

type Exclude<T, U> = T extends U ? never : T;

const isPromise = (p: any) => {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }

  return false;
};

export type Node<T, Relations extends {}> = {
  value: T;
} & Relations;

export type RelationGetters<T, Relations> = {
  [P in keyof Relations]?:
    | ((value: Exclude<T, Error | null>) => Promise<Relations[P]>)
    | Promise<Relations[P]>;
};

export async function resolveWith<T, Relations extends {}>(
  valuePromise: Promise<T>,
  relationGetters: RelationGetters<T, Relations>
): Promise<Node<T, { [P in keyof Relations]: Relations[P] | null }>> {
  const value = await valuePromise;

  const relations = Object.entries(relationGetters);

  const resolvedEntries = await Promise.all(
    relations.map(async ([prop, getter]): Promise<[string, any]> => {
      if (isNil(value)) return [prop, null];
      if (value instanceof Error) return [prop, null];

      if (typeof getter === "function") {
        const result = getter(value);

        if (isPromise(result)) {
          return [prop, await result];
        } else return [prop, result];
      } else if (isPromise(getter)) {
        return [prop, await getter];
      } else {
        return [prop, getter];
      }
    })
  );

  const resolvedRelations = Object.fromEntries(resolvedEntries) as Relations;

  return Object.assign(resolvedRelations, { value });
}
