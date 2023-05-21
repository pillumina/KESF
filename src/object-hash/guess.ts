import type { Hashable } from './hasher';

export const TYPE_MAP: { [type: string]: string } = {
  Array: 'array',
  Int8Array: 'typedarray',
  Uint8Array: 'typedarray',
  Uint8ClampedArray: 'typedarray',
  Int16Array: 'typedarray',
  Uint16Array: 'typedarray',
  Int32Array: 'typedarray',
  Uint32Array: 'typedarray',
  Float32Array: 'typedarray',
  Float64Array: 'typedarray',
  BigUint64Array: 'typedarray',
  BigInt64Array: 'typedarray',
  Buffer: 'typedarray',
  Map: 'map',
  Set: 'set',
  Date: 'date',
  String: 'string',
  Number: 'number',
  BigInt: 'bigint',
  Boolean: 'boolean',
  Object: 'object',
};

export const guessObjectType = <T>(obj: T): string => {
  if (obj === null) {
    return 'null';
  }

  if (instanceOfHashable(obj)) {
    return 'hashable';
  }
  const type = obj?.constructor?.name ?? 'unknown';
  return TYPE_MAP[type] || 'unknown';
};


export const guessType = <T>(obj: T): string => {
  const type = typeof obj;
  return type !== 'object' ? type : guessObjectType(obj);
};

export const instanceOfHashable = <T>(object: Hashable | T): boolean => {
  return typeof (object as Hashable).getHashableString === 'function';
};