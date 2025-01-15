import ErrorVariant from "./ErrorVariant";

export const ACCESS_TOKEN = "access token";
export const REFRESH_TOKEN = "refresh token";

export default class JwtError extends ErrorVariant {
  public static expired(type: string = "token"): string {
    return `${type} is expired`;
  }

  public static invalid(type: string = "token"): string {
    return `${type} is invalid`;
  }

  public static decodingError(type: string = "token"): string {
    return `Failed to decode ${type}`;
  }

  public static signingError(type: string = "token"): string {
    return `Unable to sign new ${type}`;
  }
}
