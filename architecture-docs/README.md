# Architecture

The app is a simple express app, using the nunjucks templating engine. It is hosted in AWS, with the infrastructure
defined using Kubernetes deployment files.

For MVS, as we only need to store transient session data, there is a simple architecture of the containerised web
application connecting to a Elasticache cluster.

![MVS Technical Architecture Diagram](./assets/technical-architecture.svg)

Post-MVS, we may wish to add additional features. We also may want to store the
data more permanently, allowing users to come back and edit it. A suggested architecture is below.

![POST-MVS Technical Architecture Diagram](./assets/post-mvs-technical-architecture.svg)

> [!NOTE]
> These diagrams simplify the kubernetes cluster, reducing the application to a single block

## Architecture Decision Records

### Connecting Services

_No ADRs yet for Connecting Services._

### Inherited from Care Arrangement Planning (CAP)

> [!NOTE]
> These ADRs were inherited from the Care Arrangement Planning service and may not be fully relevant to Connecting Services. They are kept for reference.

1. ✅ [Choose app language](decisions/inherited-from-cap/001-choose-app-language.md)
1. ✅ [Choose hosting environment](decisions/inherited-from-cap/002-choose-hosting-environment.md)
1. ⌛ [Use Valkey](decisions/inherited-from-cap/003-use-valkey.md)
1. 🤔 [Sending emails](decisions/inherited-from-cap/004-sending-emails.md)
1. 🤔 [Persisting permanent data](decisions/inherited-from-cap/005-persisting-permanent-data.md)
1. ✅ [Use Redis](decisions/inherited-from-cap/006-use-redis.md)

### Statuses

- ✅ Accepted
- ❌ Rejected
- 🤔 Proposed
- ⌛️ Superseded
- ♻️ Amended
