import { isNil, isPromise, Node, ResolvedValues } from "./utils";

export type RelationGetters<T, Relations> = {
  [P in keyof Relations]:
    | ((value: Exclude<T, Error | null>) => Promise<Relations[P]>)
    | Promise<Relations[P]>;
};

export async function resolveWith<T, Relations extends {}>(
  valuePromise: Promise<T>,
  relationGetters: RelationGetters<T, Relations>
): Promise<Node<T, ResolvedValues<Relations>>> {
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

  const resolvedRelations = Object.fromEntries(
    resolvedEntries
  ) as ResolvedValues<Relations>;

  return Object.assign(resolvedRelations, { value });
}
