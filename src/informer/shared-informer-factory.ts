import { KubernetesObject } from "@kubernetes/client-node";

class apiType {
    
}

interface SharedInformerFactory {
    inNamespaced(namespace: string): SharedInformerFactory;

    withName(name: string): SharedInformerFactory;

    sharedIndexInformerFor<T extends KubernetesObject>(apiTypeClass: typeof apiType, reSyncPeriodInMillis?: number): SharedIndexInformer<T>;

    getExistingSharedIndexInformer<T>(apiTypeClass: typeof apiType): SharedIndexInformer<T>;

    startAllRegisteredInformers(): Promise<void>;

    stopAllRegisteredInformers(): void;
}