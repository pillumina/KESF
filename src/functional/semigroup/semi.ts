import { contramap, struct as eqstruct} from "fp-ts/lib/Eq"
import { pipe } from "fp-ts/lib/function"
import { Ord } from "fp-ts/lib/Ord"
import { Eq } from "fp-ts/lib/Ordering"
import { concatAll, struct as sestruct } from "fp-ts/lib/Semigroup"

interface Magma<A> {
    readonly concat: (first: A, second: A) => A;
}

interface Semigroup<A> extends Magma<A> {}

const SemigroupForROArray : Semigroup<ReadonlyArray<string>> = {
    concat: (first, second) => first.concat(second)
}

const SemigroupSum: Semigroup<number> = {
    concat: (first, second) => first + second
}

const SemigroupString: Semigroup<string> = {
    concat: (first, second) => first + second
}

const SemigroupProduct: Semigroup<number> = {
    concat: (first, second) => first * second
}

const SemigroupAll: Semigroup<boolean> = {
    concat: (first, second) => first && second
}

const SemigroupAny: Semigroup<boolean> = {
    concat: (first, second) => first || second
}


/**
 * concatAll
 * * an instance of a semigroup
 * * an initial value
 * * an array of elements
 */
const sum = concatAll(SemigroupSum)(2);

console.log(sum([1, 2, 3, 4]));

const product = concatAll(SemigroupProduct)(3);

console.log(product([1, 2, 3, 4]));

const every = <A>(predicate: (a: A) => boolean) => (
    as: ReadonlyArray<A>
): boolean => concatAll(SemigroupAll)(true)(as.map(predicate));

const some = <A>(predicate: (a: A) => boolean) => (
    as: ReadonlyArray<A>
): boolean => concatAll(SemigroupAll)(false)(as.map(predicate));

/**
 * dual semigroup
 */

const reverse = <A>(S: Semigroup<A>): Semigroup<A> => ({
    concat: (first, second) => S.concat(second, first)
})

pipe(SemigroupString.concat('a', 'b'), console.log);
pipe(reverse(SemigroupString).concat('a', 'b'), console.log)


/**
 * semigroup for struct
 */
type Vector = {
    x: number;
    y: number;
}

const SemigroupVector: Semigroup<Vector> = sestruct({
    x: SemigroupSum,
    y: SemigroupSum
})

// find semigroup instance for any type
type User = {
    readonly id: number;
    readonly name: string;
}

type ReadonlyNoneEmptyArray<A> = ReadonlyArray<A> & {
    readonly 0: A;
}

const getSemigroup = <A>(): Semigroup<ReadonlyNoneEmptyArray<A>> => ({
    concat: (first, second) => [first[0], ...first.slice(1), ...second]
})

const of = <A>(a: A): ReadonlyNoneEmptyArray<A> => [a];

/**
 * order derivable semigroups
 */

const SemigroupMin: Semigroup<number> = {
    concat: (first, second) => Math.min(first, second)
}

const SemigroupMax: Semigroup<number> = {
    concat: (first, second) => Math.max(first, second)
}


interface Eq<A> {
    readonly equals: (first: A, second: A) => boolean
}

const EqNumber: Eq<number> = {
    equals: (first, second) => first === second
}

const EqString: Eq<string> = {
    equals: (first, second) => first === second
}

const not = <A>(E: Eq<A>): Eq<A> => ({
    equals: (first, second) => !E.equals(first, second)
})


// return true if the element A is included in the list as
const elem = <A>(E: Eq<A>) => (a: A) => (as: ReadonlyArray<A>): boolean => as.some((e) => E.equals(a, e));

pipe([1, 2, 3], elem(EqNumber)(2), console.log);
pipe([1, 2, 3], elem(EqNumber)(4), console.log);

type Point = {
    readonly x: number;
    readonly y: number;
}

const EqPoint: Eq<Point> = eqstruct({
    x: EqNumber,
    y: EqNumber,
})


// standard eq instance, Use e.g.
const EqStandard: Eq<User> = eqstruct({
    id: EqNumber,
    name: EqString
})

const EqID: Eq<User> = {
    equals: (first, second) => EqNumber.equals(first.id, second.id)
}

// contramap
// given an instance Eq<A>
// and a function from B to A
// we can derive an Eq<B>
const EqID2: Eq<User> = pipe(EqNumber, contramap((user: User) => user.id));



// Ord: modeling order
type Ordering = -1 | 0 | 1;

const OrdNumber: Ord<number> = {
    equals: (first, second) => first === second,
    compare: (first, second) => (first < second? -1: first > second? 1: 0)
}






