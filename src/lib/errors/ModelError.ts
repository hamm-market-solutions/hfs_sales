import ErrorVariant from "./ErrorVariant";

export default class ModelError extends ErrorVariant {
    public static notFound(type: string): string {
        return `${type} not found`;
    }

    public static drizzleError(type: string): string {
        return `unexpected drizzle error in ${type} model`;
    }
}
