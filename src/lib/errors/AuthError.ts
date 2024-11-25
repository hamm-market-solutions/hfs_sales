import ErrorVariant from "./ErrorVariant";

export default class AuthError extends ErrorVariant {
    public static unauthorized(type: string = "user"): string {
        return `${type} unauthorized to access`;
    }

    public static notAuthenticated(type: string = "user"): string {
        return `${type} not authenticated`;
    }
}