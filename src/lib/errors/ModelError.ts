import ErrorVariant from "./ErrorVariant";

export default class ModelError extends ErrorVariant {
  public static notFound(type: string): string {
    return `${type} not found`;
  }
}
