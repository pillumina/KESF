import type { Hashable } from './hasher';
import { guessType } from './guess';

import TypedArray = NodeJS.TypedArray;

export type Stringifiers = { [key: string]: (obj: any) => string };

export const PREFIX = {
  string: '<:s>',
  number: '<:n>',
  bigint: '<:bi>',
  boolean: '<:b>',
  symbol: '<:smbl>',
  undefined: '<:undf>',
  null: '<:null>',
  function: '<:func>',
  array: '',
  date: '<:date>',
  set: '<:set>',
  map: '<:map>',
};

export function _hashable(obj: Hashable): string {
  return obj.getHashableString();
}

export function _stringCoerce(obj: string): string {
  return obj;
}

export function _string(obj: string): string {
  return PREFIX.string + ':' + obj;
}

export function _stringTrimCoerce(obj: string): string {
  return obj.replace(/(\s+|\t|\r\n|\n|\r)/gm, ' ').trim();
}

export function _stringTrim(obj: string): string {
  return PREFIX.string + ':' + obj.replace(/(\s+|\t|\r\n|\n|\r)/gm, ' ').trim();
}

export function _numberCoerce(obj: number): string {
  return obj.toString();
}

export function _number(obj: number): string {
  return `${PREFIX.number}:${obj}`;
}

export function _bigIntCoerce(obj: bigint): string {
  return obj.toString();
}

export function _bigInt(obj: bigint): string {
  return `${PREFIX.bigint}:${obj.toString()}`;
}

export function _booleanCoerce(obj: boolean): string {
  return obj ? '1' : '0';
}

export function _boolean(obj: boolean): string {
  return PREFIX.boolean + ':' + obj.toString();
}

export function _symbolCoerce(): string {
  return PREFIX.symbol;
}

export function _symbol(obj: symbol): string {
  return PREFIX.symbol + ':' + obj.toString();
}

export function _undefinedCoerce(): string {
  return '';
}

export function _undefined(): string {
  return PREFIX.undefined;
}

export function _nullCoerce(): string {
  return '';
}

export function _null(): string {
  return PREFIX.null;
}

export function _functionCoerce(obj: Function): string {
  return obj.name + '=>' + obj.toString();
}

export function _function(obj: Function): string {
  return PREFIX.function + ':' + obj.name + '=>' + obj.toString();
}

export function _functionTrimCoerce(obj: Function): string {
  return (
    obj.name +
    '=>' +
    obj
      .toString()
      .replace(/(\s+|\t|\r\n|\n|\r)/gm, ' ')
      .trim()
  );
}

export function _functionTrim(obj: Function): string {
  return (
    PREFIX.function +
    ':' +
    obj.name +
    '=>' +
    obj
      .toString()
      .replace(/(\s+|\t|\r\n|\n|\r)/gm, ' ')
      .trim()
  );
}

export function _dateCoerce(obj: Date): string {
  return obj.toISOString();
}

export function _date(obj: Date): string {
  return PREFIX.date + ':' + obj.toISOString();
}

export function _arraySort(this: Stringifiers, obj: any[]): string {
  const stringifiers: Stringifiers = this;
  return (
    '[' +
    obj
      .map((item) => {
        return stringifiers[guessType(item)]!(item);
      })
      .sort()
      .toString() +
    ']'
  );
}

export function _array(this: Stringifiers, obj: any[]): string {
  const stringifiers: Stringifiers = this;
  return (
    '[' +
    obj
      .map((item) => {
        return stringifiers[guessType(item)]!(item);
      })
      .toString() +
    ']'
  );
}

export function _typedArraySort(this: Stringifiers, obj: TypedArray): string {
  const stringifiers: Stringifiers = this;
  const values: any[] = Array.prototype.slice.call(obj);
  return (
    '[' +
    values
      .map((num) => {
        return stringifiers[guessType(num)]!(num);
      })
      .sort()
      .toString() +
    ']'
  );
}

export function _typedArray(this: Stringifiers, obj: TypedArray): string {
  const stringifiers: Stringifiers = this;
  const values: any[] = Array.prototype.slice.call(obj);
  return (
    '[' +
    values
      .map((num) => {
        return stringifiers[guessType(num)]!(num);
      })
      .toString() +
    ']'
  );
}

export function _setSortCoerce(this: Stringifiers, obj: Set<any>): string {
  return _arraySort.call(this, Array.from(obj));
}

export function _setSort(this: Stringifiers, obj: Set<any>): string {
  return `${PREFIX.set}:${_arraySort.call(this, Array.from(obj))}`;
}

export function _set(this: Stringifiers, obj: Set<any>): string {
  return `${PREFIX.set}:${_array.call(this, Array.from(obj))}`;
}

export function _setCoerce(this: Stringifiers, obj: Set<any>): string {
  return _array.call(this, Array.from(obj));
}

export function _object(this: Stringifiers, obj: { [key: string]: any }): string {
  const stringifiers: Stringifiers = this;
  const keys = Object.keys(obj);
  const objArray = [];
  for (const key of keys) {
    const val = obj[key] as unknown;
    const valT = guessType(val);
    objArray.push(key + ':' + stringifiers[valT]!(val));
  }
  return '{' + objArray.toString() + '}';
}

export function _objectSort(this: Stringifiers, obj: { [key: string]: any }): string {
  const stringifiers: Stringifiers = this;
  const keys = Object.keys(obj).sort();
  const objArray = [];
  for (const key of keys) {
    const val = obj[key] as unknown;
    const valT = guessType(val);
    objArray.push(key + ':' + stringifiers[valT]!(val));
  }
  return '{' + objArray.toString() + '}';
}

export function _map(this: Stringifiers, obj: Map<any, any>): string {
  const stringifiers: Stringifiers = this;
  const arr = Array.from(obj);
  const mapped = [];
  for (const item of arr) {
    const [key, value] = item as unknown[];
    mapped.push([stringifiers[guessType(key)]!(key), stringifiers[guessType(value)]!(value)]);
  }
  return '[' + mapped.join(';') + ']';
}

export function _mapSort(this: Stringifiers, obj: Map<any, any>): string {
  const stringifiers: Stringifiers = this;
  const arr = Array.from(obj);
  const mapped = [];
  for (const item of arr) {
    const [key, value] = item as unknown[];
    mapped.push([stringifiers[guessType(key)]!(key), stringifiers[guessType(value)]!(value)]);
  }
  return '[' + mapped.sort().join(';') + ']';
}