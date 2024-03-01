## Description

A action for cloning git repositories.

## Inputs

| parameter    | description                                                                                                              | required | default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- | ------- |
| directory    | Working directory                                                                                                        | `false`  | .       |
| repositories | Repository owner and name eg: pixelfederation/gh-action-checkout \| github.repository \| main \| . \| 10 \| github.token | true     |         |
| verbose      | be more verbose                                                                                                          | `false`  | false   |
| nocheckout   | try to not use checkout if repo already exists                                                                           | `false`  | false   |

repositories format is:  
`{repo name} | { branch or tag } | { destination dir} | OPTIONAL { depth } | OPTIONAL { auth token }`

## Examples

with depth 10

```yaml
- name: clone test
  id: clonetest
  uses: pixelfederation/gh-action-checkout@v0.0.1
  with:
    repositories: |
      kubernetes/ingress-nginx/ | main | ingress | 10
      kubernetes/kubernetes/ | main | k8s | 10
      kubernetes/autoscaler/ | main | autoscaler | 10
```

with token without depth

```yaml
- name: clone again
  id: cloneagain
  uses: pixelfederation/gh-action-checkout@v0.0.1
  with:
    repositories: |
      pxfd/Devops.Infra.tf-apps | master | tf-apps | | TOKEN
      pxfd/Devops.Infra.tf-k8s | master | tf-k8s | | TOKEN
```
