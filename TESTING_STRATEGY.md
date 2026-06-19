# Testing Strategy & Quality Assurance

Carbon Coach AI follows a "Quality-by-Design" testing strategy, ensuring high reliability across the monorepo.

## 1. Backend Testing (`node:test`)
Focuses on domain logic and integration points.
- **Unit**: Validation of emission factor calculations.
- **Integration**: `supertest` for API route contracts.
- **Coverage**: Core services (`Auth`, `CarbonEstimation`, `WhatIf`).

## 2. Frontend Testing (`Vitest` + `RTL`)
- **Component**: Testing UI state changes and accessibility.
- **Store**: Validation of Zustand state transitions.
- **Mocking**: MSW for API layer isolation.

## 3. Accessibility & Compliance (`axe-core`)
- **Automated**: Integrated `axe-core` checks for WCAG 2.1 AA.
- **Manual**: Keyboard navigation audits and screen reader verification (NVDA/VoiceOver).

## 4. Continuous Integration (CI)
Our pipeline enforces:
1. `npm run lint`: ESLint + Prettier consistency.
2. `npm run typecheck`: TypeScript verification.
3. `npm run test`: Full regression suite.
