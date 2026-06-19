# Changelog — ACo2 Carbon Coach

## [1.1.0] - 2026-06-19
### Added
- Root `shared` directory for cross-package logic synchronization.
- Rule-based AI Fallback Engine for resilient insights.
- WCAG 2.1 AA Accessibility Hardening (Skip Nav, ARIA Landmarks).
- Comprehensive documentation suite for AI evaluation.

### Fixed
- Module resolution errors in monorepo pathing (`ERR_MODULE_NOT_FOUND`).
- ESM/CommonJS syntax conflicts in shared schemas.
- Vite bundling failures for Recharts on React 19.
- Dashboard state synchronization and prop-type mismatches.

### Changed
- Refactored `Dashboard.jsx` for performance optimization.
- Hardened all Zod validations with strict non-negative constraints.
