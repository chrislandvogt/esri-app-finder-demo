# Architecture Decision Records (ADRs)

## Overview
This directory contains Architecture Decision Records documenting key technical decisions for the ESRI App Finder & Builder Assistant project.

## ADR Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [001](./001-frontend-framework-selection.md) | Frontend Framework Selection | Accepted | 2025-11-05 |
| [002](./002-backend-architecture.md) | Backend Architecture - Functions vs App Service | Accepted | 2025-11-05 |
| [003](./003-ai-service-provider.md) | AI Service Provider - Azure OpenAI | Accepted | 2025-11-05 |
| [004](./004-state-management.md) | Frontend State Management Strategy | Accepted | 2025-11-05 |
| [005](./005-esri-sdk-integration.md) | ArcGIS SDK Integration Approach | Accepted | 2025-11-05 |
| [006](./006-no-authentication-v1.md) | No Authentication for v1 | Accepted | 2025-11-05 |
| [007](./007-deployment-strategy.md) | Azure Deployment Strategy | Accepted | 2025-11-05 |

## ADR Template

When creating new ADRs, use this template:

```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Describe the forces at play, the problem to solve, and constraints]

## Decision
[The decision that was made]

## Consequences
### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Tradeoff 1]
- [Tradeoff 2]

## Alternatives Considered
1. **Alternative 1**: [Description and why rejected]
2. **Alternative 2**: [Description and why rejected]

## References
- [Link to relevant documentation]
- [Related ADRs]

---
**Date**: YYYY-MM-DD  
**Author**: [Name]  
**Reviewers**: [Names]
```

## Guidelines

1. **When to create an ADR**: 
   - Significant technical decisions
   - Technology/framework choices
   - Architectural patterns
   - Major refactoring decisions

2. **What NOT to create ADRs for**:
   - Minor implementation details
   - Temporary solutions
   - Bug fixes

3. **Review process**:
   - Propose ADR in pull request
   - Get review from tech lead and at least one peer
   - Mark as "Accepted" after approval

4. **Updating ADRs**:
   - ADRs are immutable once accepted
   - If decision changes, create new ADR that supersedes old one
   - Update status of old ADR to "Superseded by ADR-XXX"
