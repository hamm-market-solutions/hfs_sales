export default class ErrorVariant {
  public static notFound(type: string): string {
    return `${type} not found`;
  }

  public static unexpected(): string {
    return "unexpected error";
  }
}
