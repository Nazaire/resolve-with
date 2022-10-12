import { resolveValues } from "./resolveValues";
import { Node } from "./types";

/**
 * Resolves relations on each item in an array
 * @param valuesPromise
 * @param relationGetters
 * @returns
 */
export async function resolveManyWith<T, Relations extends {}>(
  valuesPromise: Promise<T[]>,
  relationGetters: (value: T) => {
    [K in keyof Relations]: Promise<Relations[K]>;
  }
): Promise<Node<T, Relations>[]> {
  const values = await valuesPromise;
  const nodes = await Promise.all(
    values.map(async (value) => {
      const relations = await resolveValues(relationGetters(value));
      return { value, ...relations } as Node<T, Relations>;
    })
  );
  return nodes;
}
