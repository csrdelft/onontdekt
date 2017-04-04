/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of the state reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of the action labels
 * are unique.
 */

const typeCache: { [label: string]: boolean } = {};
export function type<T extends string>(label: T): T {
  if (typeCache[label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[label as string] = true;

  return label;
}
