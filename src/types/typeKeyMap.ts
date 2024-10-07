/**
 * Example:
 * ```
 * type User = {
 *     name: string,
 * };
 * type UserKeyMap = KeyMap<User, "user">;
 * // Results in: type UserKeyMap = { user_name: string }
 * ```
 */
export type KeyMap<T, K extends string> = {
  [P in `${K}_${keyof T & string}`]: T[keyof T];
};

/**
 * Example:
 * ```
 * type User = {
 *     name: string,
 * };
 * type Brand = {
 *     name: string,
 * };
 * type UserKeyMap = KeyMap<[[User, "user"], [Brand, "brand"]]>;
 * // Results in: type UserKeyMap = { user_name: string, brand_name: string }
 * ```
 */
export type MultiKeyMap<T extends [Record<string, any>, string][]> = {
  [K in keyof T[number][0] as `${Extract<T[number][1], string>}_${K &
    string}`]: T[number][0][K];
};
