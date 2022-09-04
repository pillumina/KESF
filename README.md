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

#### Custom Resource Object

#### Custom Resource Definition

#### Configurator Installation

#### Configurator Uprade / Rollback

#### Transition Entry Operations

#### Transition Outputs Handling



### Configurator

#### Package Layout

#### Implementation



### Auxiliary Npm Package (For Development)

>Kernel team SHALL provide a npm package for configurator development. 

#### API Objects Model Structures 

The following objects model types / identifiers are required by default:

- Kubernetes API objects:

  - KubernetesObject
  - KubernetesListObject

  - Pod
  - Deployment
  - DaemonSet
  - StatefulSet
  - ReplicaSet
  - AdvancedStatefulSet
  - AdvancedDaemonSet
  - Job
  - CronJob
  - Ingress
  - NetworkPolicy
  - ConfigMap
  - Secret
  - PersistentVolume
  - PersistentVolumeClaim
  - Namespace
  - Node
  - Role
  - RoleBinding
  - Service
  - StorageClass
  - Endpont
  - Event
  - ResourceClaim
  - ResourceRole
  - {xxx}Spec
  - {xxx}Status
  - {xxx}List
  - *Inner structures (container, ownerReference, podTemplate etc...)*

- Kubernetes Custom Object Identifiers (group, version, plural)

  - AdvancedStatefulSet
  - AdvancedDaemonSet
  - ResourceClaim
  - ResourceRole

#### Framework API Model Structures

The following types are required by default:

- Transition function input
- Transition function output
- Mutation templates (to ApiServer, Configstore etc...)



### Test Plan

#### Unit Test



#### Intergation Test







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

