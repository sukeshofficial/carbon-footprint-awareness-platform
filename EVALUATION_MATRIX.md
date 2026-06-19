# Feature Roadmap & Evaluation Matrix

This matrix maps platform features to their implementation locations for easy auditing.

| Feature Area | Component/Service | Logic Layer |
| :--- | :--- | :--- |
| **User Onboarding** | `client/src/pages/Onboarding.jsx` | `CarbonContextService` |
| **Footprint Engine** | `server/src/services/carbonEstimation.service.js` | `CarbonEstimationRepository` |
| **AI Carbon Coach** | `server/src/services/ai.service.js` | `AIService` (Streaming) |
| **What-if Simulator** | `server/src/services/whatIfScenario.service.js` | `WhatIfRepository` |
| **Accessibility** | `client/src/components/ui/` | Standard HTML5 / ARIA |
| **Shared Contracts** | `shared/schemas/` | Zod (ESM) |

## Development Philosophy
- **Modular over Monolithic**: Separated concerns via Service-Repo pattern.
- **Fail-Safe AI**: Rule-based fallbacks ensure 100% uptime for core features.
- **Data Integrity**: Unified Zod schemas eliminate frontend-backend drift.
