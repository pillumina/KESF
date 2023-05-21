import { BinaryToTextEncoding, createHash } from "crypto";
import { objectSorter, SorterOptions } from "./sorter";

const DEFAULT_ALGO = 'sha256'

const DEFAULT_ENCODE = 'hex'

export interface HasherOptions extends SorterOptions {
    algo?: string;

    encode?: BinaryToTextEncoding;
}

export interface Hashable {
    getHashableString: () => string;
}

export interface Hasher<T = unknown> {
    hash(obj: Hashable | T, opt?: HasherOptions): string;

    sort(obj: T): string;

    sortObj(obj: T): string;
}

export const hasher = (option?: HasherOptions): Hasher => {
    const sorter = objectSorter(option);

    const hash = <T>(obj: Hashable | T, opts?: HasherOptions): string => {
        const algo = opts?.algo || option?.algo || DEFAULT_ALGO;
        const encode = opts?.encode || option?.encode || DEFAULT_ENCODE;
        const sorted = sorter(obj);
        return createHash(algo).update(sorted).digest(encode);
    }

    return {
        hash: hash,
        sort: sorter,
        sortObj: sorter,
    }
}