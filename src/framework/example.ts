import { RdsCluster, RdsServer } from "./fake";
import { KindResources, Reconciler, UseResource } from "./framework"

type Resources =  KindResources<UseResource<RdsCluster, '*'> | UseResource<RdsServer>>;

export const reconciler: Reconciler<Resources> = ix => {
    ix.register({
        kind: 'RDSCluster',
        select: (ix, input) => {
            const server = ix.of('RDSServer', `${input.name}`)?.name;
            return {
                name: server,
                status: input.status || {a: '', b: ''},
            }
        },
        render: (ix, input) => {
            ix.resource({
                kind: 'RDSServer',
                name: 'test.server',
                metadata: {},
                spec: {
                    'a' : '',
                }
            });
            return null;
        },
    });
};