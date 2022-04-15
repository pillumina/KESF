interface SharedIndexInformer<T> extends SharedInformer<T>{
    addIndexer(indexers: Map<string, IndexFunction<T>>): void;

    removeIndexer(name: string): SharedIndexInformer<T>;

    getIndexer(): Indexer<T>;
}