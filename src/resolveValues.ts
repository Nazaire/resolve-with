import { isPromise } from "./utils";
import { ResolvedValues } from "./types";

/**
 * Awaits all the promises of each value in an object literal
 * @param object
 * @returns
 */
export async function resolveValues<O extends {}>(
  object: O
): Promise<ResolvedValues<O>> {
  const entries = Object.entries(object);

  const resolvedEntries = await Promise.all(
    entries.map(async ([prop, value]): Promise<[string, any]> => {
      if (isPromise(value)) {
        return [prop, await value];
      } else {
        return [prop, value];
      }
    })
  );

  const resolvedRelations = Object.fromEntries(
    resolvedEntries
  ) as ResolvedValues<O>;

  return resolvedRelations;
}
