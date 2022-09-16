
interface TRes<Spec, Status, OpFields extends keyof Status> {
    spec: Spec;
    status: Status;
    opst: Pick<Status, OpFields>;
}

interface TResLike {
    spec: unknown;
    status: unknown;
    opst: unknown;
}

interface TResMap {
    [kind: string]: TResLike;
}

export interface Metadata {
    annotations? : {[name: string]: string};
    labels?: {[name: string]: string};
}

export interface ResourceData<M extends TResMap, K extends keyof M> {
    kind:  K;
    name: string;
    metadata: Metadata;
    spec: M[K]['spec'];
    status: null | M[K]['status'];
}

// new generated resource ain't include status field as status is going to be managed by controller itself.
export interface NewResource<M extends TResMap, K extends keyof M> {
    kind: K;
    name: string;
    metadata?: Metadata;
    spec: M[K]['spec'];
}

// general type definition
export type AnyNewResource<M extends TResMap> = NewResource<M, keyof M>;

type IsObject<T> = keyof T extends never ? false: true;

export type RO<T> = {
    readonly [P in keyof T]: IsObject<T[P]> extends true ? RO<T[P]> : T[P];
};

interface Handle<M extends TResMap, K extends keyof M, P> {
    kind: K;
    select: (ix: SelectIx<M>, input: RO<ResourceData<M, K>>) => P;
    render: (ix: RenderIx<M>, input: RO<P>) => null | M[K]['opst'];
};

export interface SelectIx<M extends TResMap> {
    of<K extends keyof M> (kind: K, name: string): null | RO<ResourceData<M, K>>;
    // other methods ...
}

export interface RenderIx<M extends TResMap>{
    resource(input: AnyNewResource<M>): void;
    // ...
}

export interface Registry<M extends TResMap> {
    register<K extends keyof M, P>(handle: Handle<M, K, P>): this;
}

export const Reconcile  = <T extends TResMap>(f: (registry: Registry<T>) => unknown) => f;


