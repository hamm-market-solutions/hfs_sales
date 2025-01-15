import ErrorVariant from "./ErrorVariant";

export default class SeasonBrandPhaseError extends ErrorVariant {
  public static seasonInactive(season: number): string {
    return "season is inactive: " + season;
  }
}
