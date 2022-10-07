import { RelationGetters, resolveWith } from "./resolveWith";

export async function resolveManyWith<T, Relations extends {}>(
  valuePromises: Promise<T>[],
  relationGetters: RelationGetters<T, Relations>
) {
  return await Promise.all(
    valuePromises.map((p) => resolveWith(p, relationGetters))
  );
}
