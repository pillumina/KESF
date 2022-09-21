export type KindResources<T extends UsedResourceLike> = {
    [U in T as U['kind']]: U;
}


type PickExt<T, P extends (keyof T | '*')> = 
    P extends never ? undefined: (
      P extends '*' ? T : (
          P extends keyof T ? Pick<T, P> : never
      )
    );

/**
 * Rendered 作用在于，确定operator能够变更的status部分属性
 */
export interface UseResource<R extends ResourceLike, Rendered extends '*' | keyof R['status'] = never> {
    kind: R['kind'];
    spec: R['spec'];
    status: R['status'];
    rendered: PickExt<R['status'], Rendered>;
} 

// original resource type
type ResourceLike = {
    kind: PropertyKey;
    spec: unknown;
    status: unknown;
}

// resource type with rendered field specified
type UsedResourceLike = {
    kind: PropertyKey;
    spec: unknown;
    status: unknown;
    rendered: unknown;
}

type KindResourcesLike = {
    [kind: string]: UsedResourceLike,
}

export interface Metadata {
    annotations? : {[name: string]: string};
    labels?: {[name: string]: string};
}


export type Nullable<T> = T | null

// kubernetes resource type interface
export interface ResourceData<R extends ResourceLike> {
    kind: R['kind'];
    name: string;
    metadata: Metadata;
    spec: R['spec'];
    status: Nullable<R['status']>;
}

// new generated resource ain't include status field as status is going to be managed by controller itself.
export interface NewResource<R extends ResourceLike> {
    kind: R['kind'];
    name: string;
    metadata: Metadata;
    spec: R['spec'];
}

// Deep Readonly
// skip functions and handle union type
export type DeepRO<T> = T extends Function ? T : {readonly [K in keyof T]: DeepRO<T[K]>};


// this shall be implemented for registration
export interface Transformer<M extends KindResourcesLike, K extends keyof M, P> {
    kind: K;
    select: (ix: SelectIx<M>, input: DeepRO<ResourceData<M[K]>>) => P;
    render: (ix: RenderIx<M>, input: DeepRO<P>) => Nullable<DeepRO<M[K]>>;
}

export interface SelectIx<M extends KindResourcesLike> {
    /**
     * access the specified resources
     */
    of<K extends keyof M>(kind: K, name: string): Nullable<DeepRO<ResourceData<M[K]>>>;
}

export interface RenderIx<M extends KindResourcesLike> {
    /**
     * create resources
     */
    resource(input: NewResource<M[keyof M]>): void;
}

export interface Registry<M extends KindResourcesLike> {
    /**
     * register transformer
     */
    register<K extends keyof M, P>(transformer: Transformer<M, K, P>): this;
}

export interface Reconciler<T extends KindResourcesLike> {
    (registry: Registry<T>): unknown;
}




