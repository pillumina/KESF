interface ResourceEventHandler<T>{

}

interface SharedInformer<T>{
    addEventHandler(handler: ResourceEventHandler<T>): void;

    addEventHandlerWithReSyncPeriod(handler: ResourceEventHandler<T>, reSyncPeriod: number): void;

    run(): void;

    stop(): void;

    hasSynced(): boolean;

    lastSyncResourceVersion(): string;

    isRunning(): boolean;

    getStore(): Store<T>;
}