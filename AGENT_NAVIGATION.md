# Agent Evaluation & Navigation Guide (AI-Friendly)

This document is designed to help AI agents or developers quickly navigate and evaluate the ACo2 codebase.

## 🧭 Core Navigation Map

### Entry Points
- **Backend Entry**: `server/src/index.js` -> `server/src/app.js`
- **Frontend Entry**: `client/src/main.jsx` -> `client/src/App.jsx`
- **Shared Logic**: `shared/package.json` (ESM Entry)

### Business Logic (Where the "Brain" Is)
- **Carbon Estimation**: `server/src/services/carbonEstimation.service.js`
- **AI/Rule Fallback**: `server/src/domain/rules/fallbackEngine.js`
- **Scenario Simulator**: `server/src/services/whatIfScenario.service.js`
- **Domain Models**: `server/src/infrastructure/models/`

### Contracts & Validation
- **Schemas**: `shared/schemas/` (Zod)
- **Constants**: `shared/constants/` (Enums)

## 🛠️ Verification Paths

### To verify Code Quality:
1. Check `shared/schemas/` for synchronized validation contracts.
2. Check `server/src/infrastructure/repositories/` for the Repository Pattern.
3. Check `server/src/middlewares/errorMiddleware.js` for error handling.

### To verify Security:
1. Check `server/src/middlewares/authMiddleware.js` for JWT logic.
2. Check `server/src/app.js` for Rate Limiting and Helmet configurations.

### To verify Accessibility:
1. Check `client/src/components/layout/Navbar.jsx` for "Skip to Content".
2. Check `client/src/pages/onboarding/` for semantic `fieldset` usage.

## 🤖 AI Debugging Commands
- **Lint**: `npm run lint` (at root)
- **Backend Tests**: `cd server && npm test`
- **Type Check**: `cd client && npm run typecheck` (if applicable)
