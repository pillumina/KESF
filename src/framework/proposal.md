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