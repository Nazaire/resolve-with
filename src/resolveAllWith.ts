import { RelationGetters, resolveWith } from "./resolveWith";

/**
 * Takes an array of promises and use `resolveWith` on the results
 * @param valuePromises
 * @param relationGetters
 * @returns
 */
export async function resolveAllWith<T, Relations extends {}>(
  valuePromises: Promise<T>[],
  relationGetters: RelationGetters<T, Relations>
) {
  return await Promise.all(
    valuePromises.map((p) => resolveWith(p, relationGetters))
  );
}
