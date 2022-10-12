import { isPromise } from "./utils";

/**
 * Awaits all the promises of each value in an object literal
 * @param object
 * @returns
 */
export async function resolveValues<O extends {}>(object: {
  [K in keyof O]: Promise<O[K]>;
}): Promise<O> {
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

  const resolvedRelations = Object.fromEntries(resolvedEntries) as O;

  return resolvedRelations;
}
