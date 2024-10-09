// export type Override<
//   Type,
//   NewType extends { [key in keyof Type]?: NewType[key] },
// > = Omit<Type, keyof NewType> & NewType;
export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
