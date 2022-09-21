# [KEP] Configurator Framework

## Managed Data Structure
```json
{
    [kind: string] : {
        [name: string]: {
            input: resource-data,
            selected-result: {
                tracked-resources: {
                    [kind: string]: {
                        [name: string]: resource-data,
                    }
                },
                selected-output,
            },
            rendered-result: {
                status,
                new-resources,
            }
        }
    }
}
```

## Shallow Diff
`Pseudo Code`: 
```
if A === B return true
if A.keys.length !== B.keys.length return false
for key in A.keys {
    if A[key] !== B[key] return false
}
return true
``` 

## Example
```typescript
export const reconcile = Reconcile<ResMap> (registry => {
    registry.watch('xxx', {'labels': ''});
    registry.register({
        kind: 'rds.cluster',

        // select 会以资源信息(kind, name, metadata, spec, status) 作为输入
        // select 会被在资源发生变化 (spec, status) 时被执行
        // select 执行过程中 ix.of会追踪对其他资源的访问，访问过的任何一个资源发生变化，也会导致select被执行
        // input: resource, tracked: {resource key: resource}, result
        select: (ix, input) => {
            const server = ix.of('rds.server', `${input.name}.workload`)?.name;
            return {
                name: input.name,
                status: input.status,
            };
        },
        // render会以select的执行结果作为输入，并返回status
        // render只有在select的结果发生变化时才会执行
        // render过程中，ix.resource可以创建新的资源
        // 每一次render结果（包括status和其过程中创建的新资源）会和当前的数据进行比对，比对的结果用于刷新APIServer
        render: (ix, input) => {
            ix.resource({
               kind: 'rds.cluster',
               name: 'xxx',
               spec: {replica: 1}, 
            });
            return {
                ...input.status,
                ist: 'xxx',
            };
        },
    }).register({
        kind: 'rds.server',
        select: (ex, rest) => {

        },
        render: (ix, selected) => {
会
        },
    });
})
```