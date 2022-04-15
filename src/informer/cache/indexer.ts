type IndexFunction<T> = (obj: T, array: string[]) => void;

interface Indexer<T> extends Store<T> {
    index(indexName: string, obj: T): T[];

    indexKeys(indexName: string, indexKey: string): string[];

    byIndex(indexName: string, indexKey: string): T[];

    getIndexers(): Map<string, IndexFunction<T>>;

    addIndexers(indexers: Map<string, IndexFunction<T>>): void;

    removeIndexer(name: string): void;
}