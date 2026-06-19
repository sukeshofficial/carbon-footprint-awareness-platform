# Code Quality & Engineering Standards

The ACo2 platform is built with a focus on maintainability, scalability, and robust typing.

## 1. Monorepo Strategy
- **Shared Contracts**: Zod schemas and constants are centralized in `shared/` to ensure frontend/backend synchronization.
- **ESM Enforcement**: Explicit `package.json` configurations for ESM/CommonJS boundary safety.

## 2. Design Patterns
- **Service-Repository Pattern**: Decouples business logic from data access.
- **Validation Middleware**: Centralized Zod validation factory for all incoming requests.
- **Command/Utility Separation**: Domain logic is isolated in `src/domain/` for testability.

## 3. Style & Linting
- **ESLint**: Strict rules for React 19 and Node 22 compliance.
- **Prettier**: Automated formatting for code consistency.
- **JSDoc**: Comprehensive documentation for complex domain logic.

## 4. Error Handling
- **AppError**: Standardized operational error class.
- **Global Handler**: Centralized JSON error responses with environment-aware stack traces.
