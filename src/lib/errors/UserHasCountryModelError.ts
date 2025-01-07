import ModelError from "./ModelError";

export default class UserHasCountryModelError extends ModelError {
    public static notFound(type: string = "user has country"): string {
        return super.notFound(type);
    }

    public static updateError(type: string = "user has country"): string {
        return `Failed to update ${type}`;
    }

    public static getError(type: string = "user has country"): string {
        return `Failed to get ${type}`;
    }

    public static hasCountryError(country: string): string {
        return `User does not have country: ${country}`;
    }
}
