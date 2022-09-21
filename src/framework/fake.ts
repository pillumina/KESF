export interface RdsCluster {
    kind: 'RDSCluster';
    spec: {
        replica: number;
    };
    status: {
        a: string;
        b: string;
    };
}

export interface RdsServer {
    kind: 'RDSServer';
    spec: {
        a: string;
    };
    status: null;
}