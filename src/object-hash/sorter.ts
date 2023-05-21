import { guessType } from "./guess";
import { Hashable } from "./hasher";
import { Stringifiers, _array, _arraySort, _bigInt, _bigIntCoerce, _boolean, _booleanCoerce, _date, _dateCoerce, _function, _functionCoerce, _functionTrim, _functionTrimCoerce, _hashable, _map, _mapSort, _null, _nullCoerce, _number, _numberCoerce, _object, _objectSort, _set, _setCoerce, _setSort, _setSortCoerce, _string, _stringCoerce, _stringTrim, _stringTrimCoerce, _symbol, _symbolCoerce, _typedArray, _typedArraySort, _undefined, _undefinedCoerce } from "./stringifier";


export interface CoerceOptions {
    boolean?: boolean;

    number?: boolean;

    bigint?: boolean;

    string?: boolean;

    undefined?: boolean;

    null?: boolean;

    symbol?: boolean;

    function?: boolean;

    date?: boolean;

    set?: boolean;
}

export interface SortOptions {
    array?: boolean;

    typedArray?: boolean;

    object?: boolean;

    set?: boolean;

    map?: boolean;

    bigint?: boolean;
}

export interface TrimOptions {
    string?: boolean;

    function?: boolean;
}

export interface SorterOptions {
    coerce?: boolean | CoerceOptions | undefined;

    sort?: boolean | SortOptions | undefined;

    trim?: boolean | TrimOptions | undefined;
}

export type StringifyFn = <T>(obj: Hashable | T) => string;

export const objectSorter = (opt?: SorterOptions): StringifyFn => {
    const {sort, trim, coerce} = {
        sort: true,
        trim: false,
        coerce: true,
        ...opt,
    }

    const sortOpt: SortOptions = {
        map: typeof sort === 'boolean' ? sort : sort?.map ?? false,
        object: typeof sort === 'boolean' ? sort : sort?.object ?? false,
        array: typeof sort === 'boolean' ? sort : sort?.array ?? false,
        set: typeof sort === 'boolean' ? sort : sort?.set ?? false,
        typedArray: typeof sort === 'boolean' ? false : sort?.typedArray ?? false,
    };

    const trimOpt: TrimOptions = {
        function: typeof trim === 'boolean' ? trim : trim?.function ?? false,
        string: typeof trim === 'boolean' ? trim : trim?.string ?? false,
    };

    const coerceOpt: CoerceOptions = {
        boolean: typeof coerce === 'boolean' ? coerce : coerce?.boolean ?? false,
        number: typeof coerce === 'boolean' ? coerce : coerce?.number ?? false,
        bigint: typeof coerce === 'boolean' ? coerce : coerce?.bigint ?? false,
        string: typeof coerce === 'boolean' ? coerce : coerce?.string ?? false,
        undefined: typeof coerce === 'boolean' ? coerce : coerce?.undefined ?? false,
        null: typeof coerce === 'boolean' ? coerce : coerce?.null ?? false,
        symbol: typeof coerce === 'boolean' ? coerce : coerce?.symbol ?? false,
        function: typeof coerce === 'boolean' ? coerce : coerce?.function ?? false,
        date: typeof coerce === 'boolean' ? coerce : coerce?.date ?? false,
        set: typeof coerce === 'boolean' ? coerce : coerce?.set ?? false,
    };

    const stringifiers: Stringifiers = {
        unknown: (obj: Object): string => {
            const constructName = obj.constructor?.name ?? 'unknown';
            const objName = typeof obj.toString === 'function' ? obj.toString() : 'unknown';
            return `<:${constructName}>:${objName}`;
        }
    }

    stringifiers['hashable'] = _hashable.bind(stringifiers);
    if (trimOpt.string) {
        stringifiers['string'] = coerceOpt.string? _stringTrimCoerce.bind(stringifiers): _stringTrim.bind(stringifiers);
    } else {
        stringifiers['string'] = coerceOpt.string? _stringCoerce.bind(stringifiers): _string.bind(stringifiers);
    }

    stringifiers['number'] = coerceOpt.number? _numberCoerce.bind(stringifiers): _number.bind(stringifiers);
    stringifiers['bigint'] = coerceOpt.bigint? _bigIntCoerce.bind(stringifiers): _bigInt.bind(stringifiers);
    stringifiers['boolean'] = coerceOpt.boolean? _booleanCoerce.bind(stringifiers): _boolean.bind(stringifiers);
    stringifiers['symbol'] = coerceOpt.symbol? _symbolCoerce.bind(stringifiers): _symbol.bind(stringifiers);
    stringifiers['undefined'] = coerceOpt.undefined? _undefinedCoerce.bind(stringifiers): _undefined.bind(stringifiers);
    stringifiers['null'] = coerceOpt.null? _nullCoerce.bind(stringifiers): _null.bind(stringifiers);
    stringifiers['date'] = coerceOpt.date? _dateCoerce.bind(stringifiers): _date.bind(stringifiers);
    stringifiers['array'] = sortOpt.array? _arraySort.bind(stringifiers): _array.bind(stringifiers);
    stringifiers['typedarray'] = sortOpt.typedArray? _typedArraySort.bind(stringifiers): _typedArray.bind(stringifiers);
    stringifiers['map'] = sortOpt.map? _mapSort.bind(stringifiers): _map.bind(stringifiers);
    stringifiers['object'] = sortOpt.object? _objectSort.bind(stringifiers): _object.bind(stringifiers);
    if (sortOpt.set) {
        stringifiers['set'] = coerceOpt.set? _setSortCoerce.bind(stringifiers): _setSort.bind(stringifiers);
    } else {
        stringifiers['set'] = coerceOpt.set? _setCoerce.bind(stringifiers): _set.bind(stringifiers);
    }
    if (trimOpt.function) {
        stringifiers['function'] = coerceOpt.function? _functionTrimCoerce.bind(stringifiers): _functionTrim.bind(stringifiers);
    } else {
        stringifiers['function'] = coerceOpt.function? _functionCoerce.bind(stringifiers): _function.bind(stringifiers);
    }


    const objToString = <T>(obj: T): string => {
        return stringifiers[guessType(obj)](obj);
    }

    return objToString;
}

