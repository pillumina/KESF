interface Store<T>{
    list(): T[];

    listKeys(): string[];

    get(object: T): T;

    getByKey(key: string): T;

    getKey(object: T): string;
}