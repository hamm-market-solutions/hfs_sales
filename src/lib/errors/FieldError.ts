import ErrorVariant from "./ErrorVariant";

export default class FieldError extends ErrorVariant {
  public static exactlyOneOfFieldsRequired(fields: string[]): string {
    return `you must define exactly one of the following: ${fields.join(", ")}`;
  }
}
