export function getNestedObjectValues<T = string>(obj: object): T[] {
  return Object.values(obj).flatMap((val) =>
    val instanceof Object ? getNestedObjectValues(val) : val,
  );
}
