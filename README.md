[toc]

# Configurator Framework



## Summary

## Motivation



## Design Proposal

### Background

### Trasitional Function (Operator part)

$$
\begin{align*}
newIntentStatus = f(spec, oldIntentStatus, runningStatus)
\end{align*}
$$

### Transitional Function (Fulfillment part)

$$
\begin{align*}
newRunningStatus = g(spec, oldRunningStatus, intentStatus)
\end{align*}
$$



### User Story

### Risks and Mitigations



## Design Details

### AppController

### Configurator





## Production Readiness Review Questionaire

### Feature Enablement and Rollback

### Monitoring Requirements

- How can AppController determine if the feature is in use?

- What are the reasonable SLOs (Service Level Objectives)?
- What are the SLIs (Service Level Indicators) the service can use to determine the health of the configurator?

### Dependencies

- Does the feature depend on any specific services running in the cluster?

`AppController`

`ApiServer`

`NodeAgent`

### Scalability

- Will enabling / using the feature result in any new API calls?

`No`

- Will enabling / using this feature result in increasing size or count of the existing API objects?

`Yes`

- Will enabling / using this feature result in increasing time taken by any operations covered by existing SLIs/SLOs?

- Will enabling / using this feature result in non-negligible increase of resource usage (CPU, RAM, disk, IO, ...) in any components?



### TroubleShooting

- How does this feature react if the API server and/or etcd is unavailable?
- What are other known failure modes?
- What steps should be taken if SLOs are not being met to determine the problem?





## Appendix

